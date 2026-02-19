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

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div className="p-10 text-white">Unauthorized</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <div className="p-10 text-white">User not found</div>;
  }

  const [goldPrice, silverPrice, holdings] = await Promise.all([
    getLatestPrice("gold"),
    getLatestPrice("silver"),
    prisma.holding.findMany({
      where: { userId: user.id },
      orderBy: { purchaseDate: "desc" },
    }),
  ]);

  const goldSpot = goldPrice?.price ?? 0;
  const silverSpot = silverPrice?.price ?? 0;

  const goldHoldings = holdings.filter((h) => h.metal === "gold");
  const silverHoldings = holdings.filter((h) => h.metal === "silver");

  const goldOunces = goldHoldings.reduce((sum, h) => sum + h.ounces, 0);
  const silverOunces = silverHoldings.reduce((sum, h) => sum + h.ounces, 0);

  const goldValue = goldOunces * goldSpot;
  const silverValue = silverOunces * silverSpot;
  const totalValue = goldValue + silverValue;

  const goldInvested = goldHoldings.reduce(
    (sum, h) => sum + h.ounces * h.purchasePrice,
    0
  );
  const silverInvested = silverHoldings.reduce(
    (sum, h) => sum + h.ounces * h.purchasePrice,
    0
  );
  const totalInvested = goldInvested + silverInvested;

  const totalPnL = totalValue - totalInvested;
  const totalRoi = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const goldPnL = goldValue - goldInvested;
  const silverPnL = silverValue - silverInvested;

  const goldRoi = goldInvested > 0 ? (goldPnL / goldInvested) * 100 : 0;
  const silverRoi = silverInvested > 0 ? (silverPnL / silverInvested) * 100 : 0;

  const goldPercent = totalValue > 0 ? (goldValue / totalValue) * 100 : 0;
  const silverPercent = totalValue > 0 ? (silverValue / totalValue) * 100 : 0;

  const isPro = user.subscriptionStatus === "active";

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/holdings"
              className="rounded bg-yellow-500 px-4 py-2 font-semibold text-black hover:bg-yellow-400"
            >
              Manage Holdings
            </Link>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-400">Total Value</p>
            <p className="mt-2 text-2xl font-bold">{fmtMoney(totalValue)}</p>
            <p className="mt-2 text-xs text-gray-500">
              Based on latest spot prices
            </p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-400">Total Invested</p>
            <p className="mt-2 text-2xl font-bold">{fmtMoney(totalInvested)}</p>
            <p className="mt-2 text-xs text-gray-500">Cost basis</p>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-sm text-gray-400">Unrealized P/L</p>
            <p
              className={`mt-2 text-2xl font-bold ${
                totalPnL >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {fmtMoney(totalPnL)}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              ROI:{" "}
              <span className={totalRoi >= 0 ? "text-green-400" : "text-red-400"}>
                {fmtPct(totalRoi)}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <p className="text-sm text-yellow-400">Allocation</p>
            <p className="mt-2 text-sm text-gray-200">
              Gold:{" "}
              <span className="font-semibold">
                {fmtPct(goldPercent)}
              </span>
            </p>
            <p className="mt-1 text-sm text-gray-200">
              Silver:{" "}
              <span className="font-semibold">
                {fmtPct(silverPercent)}
              </span>
            </p>
          </div>
        </div>

        {/* Metal Breakdown */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6">
            <p className="text-sm text-yellow-400">Gold</p>
            <p className="mt-2 text-xl font-semibold">{goldOunces.toFixed(2)} oz</p>
            <p className="text-sm text-gray-300">
              Value: {fmtMoney(goldValue)}
            </p>
            <p className="text-sm text-gray-300">
              Invested: {fmtMoney(goldInvested)}
            </p>
            <p className="text-sm text-gray-300">
              P/L:{" "}
              <span className={goldPnL >= 0 ? "text-green-400" : "text-red-400"}>
                {fmtMoney(goldPnL)} ({fmtPct(goldRoi)})
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-gray-400/30 bg-gray-800 p-6">
            <p className="text-sm text-gray-200">Silver</p>
            <p className="mt-2 text-xl font-semibold">{silverOunces.toFixed(2)} oz</p>
            <p className="text-sm text-gray-300">
              Value: {fmtMoney(silverValue)}
            </p>
            <p className="text-sm text-gray-300">
              Invested: {fmtMoney(silverInvested)}
            </p>
            <p className="text-sm text-gray-300">
              P/L:{" "}
              <span className={silverPnL >= 0 ? "text-green-400" : "text-red-400"}>
                {fmtMoney(silverPnL)} ({fmtPct(silverRoi)})
              </span>
            </p>
          </div>
        </div>

        {/* Existing price dashboard */}
        <MetalDashboard
          gold={{
            price: goldSpot,
            percentChange: null,
            history1D: [],
            history7D: [],
            history30D: [],
            lastUpdated:
              goldPrice?.timestamp.toISOString() ?? new Date().toISOString(),
          }}
          silver={{
            price: silverSpot,
            percentChange: null,
            history1D: [],
            history7D: [],
            history30D: [],
            lastUpdated:
              silverPrice?.timestamp.toISOString() ?? new Date().toISOString(),
          }}
          isPro={isPro}
        />
      </div>
    </main>
  );
}