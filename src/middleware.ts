import type { MiddlewareHandler } from "astro";
import { authMiddleware } from "$lib/auth";

export const onRequest: MiddlewareHandler = async (ctx, next) => authMiddleware(ctx, next);
