import type { APIContext } from "astro";
import { deleteSessionByToken, clearSessionCookie, SESSION_COOKIE } from "$lib/auth";

export async function POST(ctx: APIContext) {
  const sid = ctx.cookies.get(SESSION_COOKIE)?.value;
  if (sid) await deleteSessionByToken(sid);
  clearSessionCookie(ctx);
  return ctx.redirect("/");
}
