import type { APIRoute } from "astro";
import { lucia } from "$lib/auth/lucia";

export const POST: APIRoute = async ({ locals, cookies, redirect }) => {
  if (locals.session) {
    await lucia.invalidateSession(locals.session.id);
  }
  const blank = lucia.createBlankSessionCookie();
  cookies.set(blank.name, blank.value, blank.attributes);
  return redirect("/");
};
