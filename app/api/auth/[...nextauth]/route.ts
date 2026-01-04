import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always send users to dashboard after login
      if (url.startsWith("/")) return `${baseUrl}/dashboard`;
      if (new URL(url).origin === baseUrl) return `${baseUrl}/dashboard`;
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
