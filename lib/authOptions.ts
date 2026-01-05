// lib/authOptions.ts

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // 🔴 Explicitly set secret (do not rely on implicit env wiring)
  secret: process.env.NEXTAUTH_SECRET,

  // 🔴 Turn on verbose logging in Vercel logs
  debug: true,

  logger: {
    error(code, metadata) {
      console.error("[NextAuth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[NextAuth][warn]", code);
    },
    debug(code, metadata) {
      console.log("[NextAuth][debug]", code, metadata);
    },
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ account, profile }) {
      console.log("[NextAuth][signIn]", {
        provider: account?.provider,
        type: account?.type,
        profileEmail: (profile as any)?.email,
      });
      return true;
    },

    async jwt({ token, account, profile }) {
      // On initial sign-in, persist basic user info into the token
      if (account && profile) {
        const p: any = profile;
        token.email = p?.email ?? token.email;
        token.name = p?.name ?? token.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = (token.email as string) ?? session.user.email;
        session.user.name = (token.name as string) ?? session.user.name;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allow internal redirects only
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};
