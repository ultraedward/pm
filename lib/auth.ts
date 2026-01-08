// lib/auth.ts
import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

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

  callbacks: {
    async session({ session, user }) {
      if (!session.user) return session

      // 🔥 FORCE fresh DB read every time
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          isPro: true,
        },
      })

      if (dbUser) {
        session.user.id = dbUser.id
        // @ts-expect-error
        session.user.isPro = dbUser.isPro
      }

      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
