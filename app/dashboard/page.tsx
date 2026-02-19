export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MetalDashboard from "@/components/MetalDashboard";
import Link from "next/link";

async function getLatestPrice(metal: "gold" | "silver") {
  return prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div className="p-10 text-white">Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { alerts: true },
  });

  if (!user) {
    return <div className="p-10 text-white">User not found</div>;
  }

  const goldPrice = await getLatestPrice("gold");
  const silverPrice = await getLatestPrice("silver");

  const holdings = await prisma.holding.findMany({
    where: { userId: user.id },
  });

  const goldOunces = holdings
    .filter((h) => h.metal === "gold")
    .reduce((sum, h) => sum + h.ounces, 0);

  const silverOunces = holdings
    .filter((h) => h.metal === "silver")
    .reduce((sum, h) => sum + h.ounces, 0);

  const goldValue = goldPrice ? goldOunces * goldPrice.price : 0;
  const silverValue = silverPrice ? silverOunces * silverPrice.price : 0;

  const totalValue = goldValue + silverValue;

  const goldPercent =
    totalValue > 0 ? (goldValue / totalValue) * 100 : 0;
  const silverPercent =
    totalValue > 0 ? (silverValue / totalValue) * 100 : 0;

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-6xl space-y-10">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link
            href="/dashboard/holdings"
            className="rounded bg-yellow-500 px-4 py-2 text-black font-semibold hover:bg-yellow-400"
          >
            Manage Holdings
          </Link>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-400">Total Value</p>
            <p className="mt-2 text-2xl font-bold">
              ${totalValue.toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <p className="text-sm text-yellow-400">Gold</p>
            <p className="mt-2 text-xl font-semibold">
              {goldOunces.toFixed(2)} oz
            </p>
            <p className="text-sm text-gray-400">
              ${goldValue.toFixed(2)} ({goldPercent.toFixed(1)}%)
            </p>
          </div>

          <div className="rounded-xl border border-gray-400/30 bg-gray-800 p-6">
            <p className="text-sm text-gray-300">Silver</p>
            <p className="mt-2 text-xl font-semibold">
              {silverOunces.toFixed(2)} oz
            </p>
            <p className="text-sm text-gray-400">
              ${silverValue.toFixed(2)} ({silverPercent.toFixed(1)}%)
            </p>
          </div>

        </div>

        {/* Existing price dashboard */}
        <MetalDashboard
          gold={{
            price: goldPrice?.price ?? 0,
            percentChange: null,
            history1D: [],
            history7D: [],
            history30D: [],
            lastUpdated: goldPrice?.timestamp.toISOString() ?? new Date().toISOString(),
          }}
          silver={{
            price: silverPrice?.price ?? 0,
            percentChange: null,
            history1D: [],
            history7D: [],
            history30D: [],
            lastUpdated: silverPrice?.timestamp.toISOString() ?? new Date().toISOString(),
          }}
          isPro={user.subscriptionStatus === "active"}
        />
      </div>
    </main>
  );
}