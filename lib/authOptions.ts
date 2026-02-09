import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "database",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async redirect({ url, baseUrl }) {
      // If NextAuth is trying to redirect to the homepage,
      // instead send the user back to alerts
      if (url === baseUrl || url === `${baseUrl}/`) {
        return `${baseUrl}/alerts`;
      }

      // Allow relative callback URLs
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Allow same-origin absolute URLs
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Fallback safety
      return `${baseUrl}/alerts`;
    },
  },
};