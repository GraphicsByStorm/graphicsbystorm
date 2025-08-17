import type { APIRoute } from "astro";
import { z } from "zod";
import { lucia, prisma } from "$lib/auth/lucia";
import bcrypt from "bcryptjs";


const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().optional()
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return new Response("Invalid", { status: 400 });

  const { email, password, name, phone } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return new Response("Email in use", { status: 409 });

  // store password hash (v3 doesn’t mandate where; user table is fine)
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, name, phone, /* optional: */ /* passwordHash */ }
  });

  // If you used a separate credentials table before, you can keep using it.
  // Example with a `Key` table:
  // await prisma.key.create({ data: { id: `email:${email}`, userId: user.id, hashedPassword: passwordHash } });

  const session = await lucia.createSession(user.id, {});
  const cookie = lucia.createSessionCookie(session.id);
  cookies.set(cookie.name, cookie.value, cookie.attributes);

  return redirect("/account");
};
