import type { APIRoute } from "astro";
import { z } from "zod";
import { lucia, prisma } from "$lib/auth/lucia";
import bcrypt from "bcryptjs";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const { email, password } = parsed.data;

  // If you stored hashes in `Key`:
  const key = await prisma.key.findUnique({ where: { id: `email:${email}` }, include: { user: true } });
  if (!key?.hashedPassword || !key.user) return new Response("Invalid", { status: 401 });

  const ok = await bcrypt.compare(password, key.hashedPassword);
  if (!ok) return new Response("Invalid", { status: 401 });

  const session = await lucia.createSession(key.user.id, {});
  const cookie = lucia.createSessionCookie(session.id);
  cookies.set(cookie.name, cookie.value, cookie.attributes);

  return redirect("/account");
};
