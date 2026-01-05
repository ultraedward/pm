// lib/authOptions.ts

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),

    async createUser(data: AdapterUser) {
      return prisma.user.create({
        data: {
          // ONLY fields that exist in your Prisma User model
          email: data.email,

          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};
