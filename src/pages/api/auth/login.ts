import type { APIContext } from "astro";
import { prisma } from "$lib/db";
import { verifyPassword, createSession, setSessionCookie } from "$lib/auth";

export async function POST(ctx: APIContext) {
  const fd = await ctx.request.formData();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return new Response("Invalid credentials", { status: 401 });
  }

  const { token, expiresAt } = await createSession(user.id);
  setSessionCookie(ctx, token, expiresAt);

  return ctx.redirect("/account");
}
