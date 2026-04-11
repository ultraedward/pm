import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PricingClient } from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing — Lode",
  description:
    "Lode is free forever with 3 price alerts and full portfolio tracking. Upgrade to Pro for unlimited alerts.",
  alternates: {
    canonical: "https://lode.rocks/pricing",
  },
  openGraph: {
    title: "Pricing — Lode",
    description:
      "Lode is free forever with 3 price alerts and full portfolio tracking. Upgrade to Pro for unlimited alerts.",
    url: "https://lode.rocks/pricing",
  },
};

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  let isPro = false;
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { subscriptionStatus: true },
    });
    isPro = dbUser?.subscriptionStatus === "active";
  }

  return (
    <main className="min-h-screen bg-surface px-6 py-24 text-white">
      <div className="mx-auto max-w-4xl space-y-16">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight">Pricing</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            One free tier, one pro tier. No surprises.
          </p>
        </div>

        <PricingClient isPro={isPro} isLoggedIn={!!session?.user?.email} />

        <p className="text-center text-sm text-gray-600">
          Cancel or change plans at any time.
        </p>

      </div>
    </main>
  );
}
