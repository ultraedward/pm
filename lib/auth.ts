import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    // Keep whichever providers you actually use / have env vars for.
    // If you only use one, you can delete the other safely.
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // expose user id + isPro on the session
      if (session.user) {
        // @ts-expect-error augment session.user
        session.user.id = user.id;
        // @ts-expect-error augment session.user
        session.user.isPro = (user as any).isPro ?? false;
      }
      return session;
    },
  },
  // In prod, keep this off unless you want verbose logs.
  debug: process.env.NODE_ENV === "development",
};
