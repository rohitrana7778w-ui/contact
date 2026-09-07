import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "PROVIDER" | "ADMIN";
      phone?: string | null;
      providerId?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    phone?: string | null;
    providerId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    phone?: string | null;
    providerId?: string | null;
  }
}
