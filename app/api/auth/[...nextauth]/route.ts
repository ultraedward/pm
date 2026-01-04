import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: "login@pm-iota-wheat.vercel.app",
      async sendVerificationRequest({ identifier, url }) {
        await resend.emails.send({
          from: "Precious Metals <login@pm-iota-wheat.vercel.app>",
          to: identifier,
          subject: "Sign in to Precious Metals",
          html: `
            <p>Click the link below to sign in:</p>
            <p><a href="${url}">${url}</a></p>
          `,
        });
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});

export { handler as GET, handler as POST };
