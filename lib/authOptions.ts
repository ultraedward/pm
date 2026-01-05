import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    async createUser(data) {
      return prisma.user.create({
        data: {
          email: data.email!,
          stripeStatus: "free",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    },
  },

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user) return user;

        return prisma.user.create({
          data: {
            email: credentials.email,
            stripeStatus: "free",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};
