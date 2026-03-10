// /app/dashboard/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

type Metal = "gold" | "silver";

async function getLatestPrice(metal: Metal) {
  return prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });
}

async function getRecentPrices(metal: Metal) {
  return prisma.price.findMany({
    where: { metal },
    orderBy: { timestamp: "asc" },
    take: 30,
  });
}

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

function fmtPct(n: number) {
  return `${n.toFixed(2)}%`;
}

function buildSparkline(values: number[], width = 300, height = 100) {
  if (!values.length) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, name: true },
  });

  if (!user) redirect("/login");

  const [holdings, goldPriceRow, silverPriceRow, goldHistory, silverHistory] =
    await Promise.all([
      prisma.holding.findMany({ where: { userId: user.id } }),
      getLatestPrice("gold"),
      getLatestPrice("silver"),
      getRecentPrices("gold"),
      getRecentPrices("silver"),
    ]);

  const goldSpot = goldPriceRow?.price ?? 0;
  const silverSpot = silverPriceRow?.price ?? 0;

  let totalInvested = 0;
  let totalValue = 0;

  for (const h of holdings) {
    const ounces = Number(h.ounces);
    const purchasePrice = Number(h.purchasePrice);
    const spot = h.metal === "gold" ? goldSpot : silverSpot;

    totalInvested += ounces * purchasePrice;
    totalValue += ounces * (spot || purchasePrice);
  }

  const gainLoss = totalValue - totalInvested;
  const pctReturn =
    totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0;
  const gainColor =
    gainLoss >= 0 ? "text-green-400" : "text-red-400";

  // 30d equity
  const goldOunces = holdings
    .filter((h) => h.metal === "gold")
    .reduce((sum, h) => sum + Number(h.ounces), 0);

  const silverOunces = holdings
    .filter((h) => h.metal === "silver")
    .reduce((sum, h) => sum + Number(h.ounces), 0);

  const historyLength = Math.min(
    goldHistory.length,
    silverHistory.length
  );

  const portfolioHistory: number[] = [];

  for (let i = 0; i < historyLength; i++) {
    const goldPrice = goldHistory[i]?.price ?? 0;
    const silverPrice = silverHistory[i]?.price ?? 0;

    portfolioHistory.push(
      goldOunces * goldPrice + silverOunces * silverPrice
    );
  }

  const portfolioSpark = buildSparkline(portfolioHistory);

  const firstValue = portfolioHistory[0] ?? totalValue;
  const lastValue =
    portfolioHistory[portfolioHistory.length - 1] ??
    totalValue;

  const change30d = lastValue - firstValue;
  const pct30d =
    firstValue > 0 ? (change30d / firstValue) * 100 : 0;
  const changeColor30d =
    change30d >= 0 ? "text-green-400" : "text-red-400";

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">
              Welcome, {user.name}.
            </p>
          </div>
          <Link
            href="/dashboard/holdings"
            className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
          >
            Holdings
          </Link>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <p className="text-sm text-gray-400">
            Total Portfolio Value
          </p>
          <p className="text-3xl font-bold">
            {fmtMoney(totalValue)}
          </p>
          <p className={`text-sm ${gainColor}`}>
            {gainLoss >= 0 ? "+" : ""}
            {fmtMoney(gainLoss)} ({fmtPct(pctReturn)})
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Portfolio Equity (30d)
              </p>
              <p className={`text-sm font-semibold ${changeColor30d}`}>
                {change30d >= 0 ? "+" : ""}
                {fmtMoney(change30d)} ({fmtPct(pct30d)})
              </p>
            </div>
          </div>

          <svg
            width="100%"
            height="120"
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              points={portfolioSpark}
            />
          </svg>
        </div>

      </div>
    </main>
  );
}