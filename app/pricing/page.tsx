import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";
import { SiteFooter } from "@/components/SiteFooter";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing — Free & Pro | Lode",
  description:
    "Lode is free for every stacker. Upgrade to Pro for extended price history, portfolio CSV export, and annual tax snapshots.",
  alternates: {
    canonical: "https://lode.rocks/pricing",
  },
  openGraph: {
    title: "Pricing — Free & Pro | Lode",
    description:
      "Free: live spot prices, unlimited alerts, portfolio tracker, melt calculators. Pro: 90-day charts, CSV export, tax snapshots.",
    url: "https://lode.rocks/pricing",
  },
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user?.email;

  let isPro = false;
  if (isLoggedIn && session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptionStatus: true, proUntil: true },
    });
    isPro = hasProAccess({
      stripeStatus: dbUser?.subscriptionStatus,
      proUntil: dbUser?.proUntil,
    });
  }

  return (
    <main
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-10 sm:pt-28 sm:pb-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label mb-4 animate-fade-up">Pricing</p>
          <h1
            className="font-black text-white animate-fade-up animate-delay-100"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              letterSpacing: "-0.04em",
              lineHeight: "0.95",
            }}
          >
            Simple pricing.<br />No surprises.
          </h1>
          <p
            className="mt-6 text-base leading-relaxed max-w-sm mx-auto animate-fade-up animate-delay-200"
            style={{ color: "var(--text-muted)" }}
          >
            Core tools are free forever. Pro adds extended history and tax reporting for serious stackers.
          </p>
        </div>
      </section>

      {/* ── PRICING CARDS ────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-2xl">
          <PricingClient isPro={isPro} isLoggedIn={isLoggedIn} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
