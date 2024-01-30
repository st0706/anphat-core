// eslint-disable-next-line no-use-before-define
import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   *
   * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
   * object and keep type safety.
   *
   * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
   */
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      roles: { teamId: string; role: Role }[];
    };
  }

  interface Profile {
    requested: {
      tenant: string;
    };
    roles: string[];
    groups: string[];
  }
}
