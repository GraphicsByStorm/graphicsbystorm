// src/middleware.ts
import { lucia } from "$lib/auth/lucia";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (ctx, next) => {
  const sessionId = ctx.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    ctx.locals.user = null;
    ctx.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  // refresh cookie if fresh, or clear if invalid
  if (session && session.fresh) {
    const cookie = lucia.createSessionCookie(session.id);
    ctx.cookies.set(cookie.name, cookie.value, cookie.attributes);
  } else if (!session) {
    const blank = lucia.createBlankSessionCookie();
    ctx.cookies.set(blank.name, blank.value, blank.attributes);
  }

  ctx.locals.session = session;
  ctx.locals.user = user;
  return next();
});
