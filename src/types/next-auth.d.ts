import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      address?: string;
    };
    accessToken?: string;
  }

  interface User {
    id?: string;
    name?: string;
    email?: string;
    accessToken?: string;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken?: string;
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
    };
  }
}
