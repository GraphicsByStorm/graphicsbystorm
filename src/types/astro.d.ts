import "astro";

declare module "astro" {
  interface Locals {
    session: { id: string; userId: string } | null;
    user: { id: string; email: string; name: string | null; phone: string | null } | null;
  }
}

export {};
