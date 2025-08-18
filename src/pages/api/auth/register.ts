import type { APIContext } from "astro";
import { prisma } from "$lib/db";
import { hashPassword, createSession, setSessionCookie } from "$lib/auth";

export async function POST(ctx: APIContext) {
  const fd = await ctx.request.formData();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const name = (String(fd.get("name") ?? "") || null) as string | null;
  const phone = (String(fd.get("phone") ?? "") || null) as string | null;

  if (!email || !password || password.length < 8) {
    return new Response("Invalid input", { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return new Response("Email already registered", { status: 409 });

  const user = await prisma.user.create({
    data: { email, passwordHash: hashPassword(password), name, phone },
  });

  const { token, expiresAt } = await createSession(user.id);
  setSessionCookie(ctx, token, expiresAt);

  return ctx.redirect("/account");
}
