import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  /**
   * ✅ CRITICAL
   * You do NOT have Account / Session tables
   * so we MUST use JWT-based sessions
   */
  session: {
    strategy: "jwt",
  },

  /**
   * ✅ CRITICAL
   * If this is missing or mismatched, login silently fails
   */
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /**
     * Attach user ID + email to token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },

    /**
     * Expose user data to the client session
     */
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  /**
   * Helps surface real errors instead of silent failures
   */
  debug: process.env.NODE_ENV === "development",
};