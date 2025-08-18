import type { APIContext } from "astro";
import { prisma } from "$lib/db";

export async function POST(ctx: APIContext) {
  const user = ctx.locals.user;
  if (!user) return ctx.redirect("/login");

  const fd = await ctx.request.formData();

  const name = (String(fd.get("name") ?? "") || null) as string | null;
  const phone = (String(fd.get("phone") ?? "") || null) as string | null;

  const line1 = String(fd.get("line1") ?? "");
  const line2 = (String(fd.get("line2") ?? "") || null) as string | null;
  const city = String(fd.get("city") ?? "");
  const state = (String(fd.get("state") ?? "") || null) as string | null;
  const postal = String(fd.get("postal") ?? "");
  const country = String(fd.get("country") ?? "");

  await prisma.user.update({
    where: { id: user.id },
    data: { name, phone },
  });

  await prisma.address.upsert({
    where: { userId_isDefault: { userId: user.id, isDefault: true } },
    create: { userId: user.id, line1, line2, city, state, postal, country, isDefault: true },
    update: { line1, line2, city, state, postal, country },
  });

  return ctx.redirect("/account");
}
