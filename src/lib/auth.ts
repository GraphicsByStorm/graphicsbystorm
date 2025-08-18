import * as crypto from "node:crypto";
import bcrypt from "bcryptjs";
import type { APIContext, MiddlewareHandler } from "astro";
import { prisma } from "./db";

export const SESSION_COOKIE = "sid";
const SESSION_DAYS = 30;

const b64url = (buf: Buffer) =>
  buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

export const newToken = () => b64url(crypto.randomBytes(32));
export const tokenHash = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);
export const verifyPassword = (password: string, hash: string) => bcrypt.compareSync(password, hash);

export async function createSession(userId: string) {
  const token = newToken();
  const hash = tokenHash(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.session.create({ data: { userId, tokenHash: hash, expiresAt } });
  return { token, expiresAt };
}

export async function deleteSessionByToken(token: string) {
  const hash = tokenHash(token);
  try {
    await prisma.session.delete({ where: { tokenHash: hash } });
  } catch {
    // silently ignore
  }
}

export function setSessionCookie(ctx: APIContext, token: string, expires: Date) {
  ctx.cookies.set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: ctx.url.protocol === "https:" || process.env.NODE_ENV === "production",
    expires,
  });
}

export function clearSessionCookie(ctx: APIContext) {
  ctx.cookies.delete(SESSION_COOKIE, { path: "/" });
}

export const authMiddleware: MiddlewareHandler = async (ctx, next) => {
  const sid = ctx.cookies.get(SESSION_COOKIE)?.value;
  ctx.locals.session = null;
  ctx.locals.user = null;

  if (sid) {
    const hash = tokenHash(sid);
    const session = await prisma.session.findUnique({
      where: { tokenHash: hash },
      include: { user: true },
    });
    if (session && session.expiresAt > new Date()) {
      ctx.locals.session = { id: session.id, userId: session.userId };
      ctx.locals.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        phone: session.user.phone,
      };
    }
  }

  return next();
};
