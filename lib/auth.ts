import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { buildWelcomeHtml } from "@/lib/email/welcomeEmail";
import { buildMagicLinkHtml } from "@/lib/email/magicLinkEmail";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://lode.rocks";

async function sendWelcomeEmail(email: string, name: string | null) {
  if (!process.env.RESEND_API_KEY) return;

  // Fetch live gold price to include in the email
  let goldPrice: number | null = null;
  try {
    const row = await prisma.price.findFirst({
      where: { metal: "gold" },
      orderBy: { timestamp: "desc" },
    });
    goldPrice = row?.price ?? null;
  } catch {
    // Non-fatal — send the email without a price
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM ?? "Lode <onboarding@resend.dev>";
  const firstName = name?.split(" ")[0] ?? "";

  const html = buildWelcomeHtml({ firstName, goldPrice, baseUrl: BASE_URL });

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: "Welcome to Lode — set your first alert",
      html,
    });
  } catch (err) {
    console.error("[auth] Welcome email failed:", err);
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    EmailProvider({
      // We handle sending ourselves via Resend — no SMTP config needed
      sendVerificationRequest: async ({ identifier: email, url }) => {
        if (!process.env.RESEND_API_KEY) {
          console.error("[auth] RESEND_API_KEY not set — magic link not sent");
          return;
        }

        const host = new URL(BASE_URL).host;
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.RESEND_FROM ?? "Lode <onboarding@resend.dev>";

        await resend.emails.send({
          from,
          to: email,
          subject: "Your Lode sign-in link",
          html: buildMagicLinkHtml({ url, host }),
        });
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      // On first login, persist user id to token
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // Attach user id to session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  events: {
    // Fires exactly once per user — on account creation, not on every sign-in
    async createUser({ user }) {
      if (user.email) {
        await sendWelcomeEmail(user.email, user.name ?? null);
      }
    },
  },
};
