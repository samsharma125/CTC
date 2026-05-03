import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;      // ✅ ADD THIS
      role?: string;
      email?: string;
      name?: string;
      image?: string;
    };
  }
}