// lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  // (optional) if you have a custom login page
  pages: {
    signIn: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@email.com" },
        password: { label: "App Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password ?? "";

        if (!email || !password) return null;

        // single shared app password (no per-user password field in DB)
        if (!process.env.APP_PASSWORD || password !== process.env.APP_PASSWORD) {
          return null;
        }

        // find or create user
        const existing = await prisma.user.findFirst({
          where: { email },
          select: { id: true, email: true },
        });

        const user =
          existing ??
          (await prisma.user.create({
            data: { email },
            select: { id: true, email: true },
          }));

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Persist user.id into the token on sign-in
      if (user?.id) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      // Expose token.id on session.user.id
      if (session.user) {
        (session.user as any).id = (token as any).id as string | undefined;
      }
      return session;
    },
  },
};
