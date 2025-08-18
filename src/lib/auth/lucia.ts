import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { prisma } from "$lib/db"; // <-- use singleton

export const lucia = new Lucia(
  new PrismaAdapter(prisma.session, prisma.user),
  {
    sessionCookie: { attributes: { secure: import.meta.env.PROD } },
    getUserAttributes: (attrs) => ({
      email: attrs.email,
      name: attrs.name,
      phone: attrs.phone
    })
  }
);

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      email: string;
      name: string | null;
      phone: string | null;
    };
  }
}
