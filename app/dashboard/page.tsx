import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const [gold, silver, alertCount] = await Promise.all([
    prisma.price.findFirst({
      where: { metal: "gold" },
      orderBy: { timestamp: "desc" },
    }),
    prisma.price.findFirst({
      where: { metal: "silver" },
      orderBy: { timestamp: "desc" },
    }),
    prisma.alert.count({
      where: { userId: user.id },
    }),
  ]);

  const isPro = user.subscriptionStatus === "active";

  return (
    <div className="mx-auto max-w-6xl p-10 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            isPro
              ? "bg-green-500/20 text-green-400"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {isPro ? "Pro Plan" : "Free Plan"}
        </span>
      </div>

      {/* Prices */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="panel p-8 space-y-2">
          <div className="text-gray-400 text-sm uppercase tracking-wide">
            Gold
          </div>
          <div className="text-5xl font-bold">
            ${gold?.price?.toFixed(2) ?? "--"}
          </div>
          <div className="text-gray-500 text-sm">
            Last updated{" "}
            {gold
              ? new Date(gold.timestamp).toLocaleTimeString()
              : "N/A"}
          </div>
        </div>

        <div className="panel p-8 space-y-2">
          <div className="text-gray-400 text-sm uppercase tracking-wide">
            Silver
          </div>
          <div className="text-5xl font-bold">
            ${silver?.price?.toFixed(2) ?? "--"}
          </div>
          <div className="text-gray-500 text-sm">
            Last updated{" "}
            {silver
              ? new Date(silver.timestamp).toLocaleTimeString()
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="panel p-8 flex items-center justify-between">
        <div>
          <div className="text-gray-400 text-sm uppercase tracking-wide">
            Your Alerts
          </div>
          <div className="text-3xl font-bold">
            {alertCount}
          </div>
        </div>

        <Link
          href="/alerts/new"
          className="rounded bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-200"
        >
          + Create Alert
        </Link>
      </div>
    </div>
  );
}