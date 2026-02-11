import Link from "next/link";
import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const user = await requireUser();

  const [latestGold, latestSilver, alertCount] = await Promise.all([
    prisma.price.findFirst({
      where: { metal: "gold" },
      orderBy: { timestamp: "desc" },
    }),
    prisma.price.findFirst({
      where: { metal: "silver" },
      orderBy: { timestamp: "desc" },
    }),
    prisma.alert.count({
      where: { userId: user.id, active: true },
    }),
  ]);

  const plan = user.subscriptionStatus === "active" ? "PRO" : "FREE";

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-8 py-20 space-y-24">
        
        {/* HERO SECTION */}
        <section className="space-y-6">
          <h1 className="text-6xl font-extrabold tracking-tight">
            Precious Metals.
            <br />
            <span className="text-gray-400">Under Control.</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl">
            Track gold and silver prices in real time.
            Set alerts. Move when it matters.
          </p>

          <div className="flex gap-6 pt-4">
            <Link
              href="/alerts/new"
              className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition"
            >
              Create Alert
            </Link>

            <Link
              href="/alerts"
              className="border border-gray-700 px-6 py-3 text-gray-300 hover:bg-gray-900 transition"
            >
              View Alerts
            </Link>
          </div>
        </section>

        {/* LIVE PRICES */}
        <section className="grid md:grid-cols-2 gap-12">
          <div className="space-y-3">
            <div className="text-sm text-gray-500 uppercase tracking-widest">
              Gold
            </div>
            <div className="text-5xl font-bold">
              ${latestGold?.price?.toFixed(2) ?? "—"}
            </div>
            <div className="text-gray-500 text-sm">
              Latest market price
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-500 uppercase tracking-widest">
              Silver
            </div>
            <div className="text-5xl font-bold">
              ${latestSilver?.price?.toFixed(2) ?? "—"}
            </div>
            <div className="text-gray-500 text-sm">
              Latest market price
            </div>
          </div>
        </section>

        {/* USER STATUS */}
        <section className="border-t border-gray-900 pt-16 grid md:grid-cols-3 gap-12">
          <div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">
              Plan
            </div>
            <div className="text-3xl font-bold mt-2">
              {plan}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 uppercase tracking-widest">
              Active Alerts
            </div>
            <div className="text-3xl font-bold mt-2">
              {alertCount}
            </div>
          </div>

          <div className="flex items-end">
            {plan === "FREE" ? (
              <Link
                href="/pricing"
                className="bg-white text-black px-6 py-3 font-medium hover:bg-gray-200 transition"
              >
                Upgrade to Pro
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="border border-gray-700 px-6 py-3 text-gray-300 hover:bg-gray-900 transition"
              >
                Manage Billing
              </Link>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}