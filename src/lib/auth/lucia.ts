// src/lib/auth/lucia.ts
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// v3: PrismaAdapter(sessionModel, userModel)
export const lucia = new Lucia(
  new PrismaAdapter(prisma.session, prisma.user),
  {
    sessionCookie: {
      attributes: {
        secure: import.meta.env.PROD
      }
    },
    // Expose selected DB fields on `locals.user`
    getUserAttributes: (attrs) => ({
      email: attrs.email,
      name: attrs.name,
      phone: attrs.phone
    })
  }
);

// Tell Lucia which instance type to use + what extra user fields exist
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
