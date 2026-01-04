import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth({
  ...authOptions,
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Always send user to dashboard after login
      return `${baseUrl}/dashboard`;
    },
    async session({ session, user }) {
      if (session.user && user?.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
