export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getCurrentPrice(metal: string) {
  const latest = await prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });

  return latest?.price ?? 0;
}

export default async function HoldingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const holdings = await prisma.holding.findMany({
    where: { userId: user.id },
  });

  const goldPrice = await getCurrentPrice("gold");
  const silverPrice = await getCurrentPrice("silver");

  let totalValue = 0;
  let totalInvested = 0;

  const enriched = holdings.map((h) => {
    const currentPrice = h.metal === "gold" ? goldPrice : silverPrice;
    const value = h.ounces * currentPrice;
    const invested = h.costBasis ? h.ounces * h.costBasis : 0;

    totalValue += value;
    totalInvested += invested;

    return {
      ...h,
      value,
      invested,
      profit: value - invested,
    };
  });

  const totalProfit = totalValue - totalInvested;

  return (
    <main className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Your Portfolio
      </h1>

      <div className="grid gap-6 mb-10">
        {enriched.map((h) => (
          <div
            key={h.id}
            className="p-6 rounded-xl bg-neutral-900"
          >
            <h2 className="text-xl font-semibold">
              {h.metal.toUpperCase()}
            </h2>
            <p>Ounces: {h.ounces}</p>
            <p>Current Value: ${h.value.toFixed(2)}</p>
            <p>
              Profit/Loss:{" "}
              <span
                className={
                  h.profit >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                ${h.profit.toFixed(2)}
              </span>
            </p>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl bg-neutral-800">
        <h2 className="text-2xl font-semibold mb-4">
          Portfolio Summary
        </h2>
        <p>Total Value: ${totalValue.toFixed(2)}</p>
        <p>Total Invested: ${totalInvested.toFixed(2)}</p>
        <p
          className={
            totalProfit >= 0
              ? "text-green-400"
              : "text-red-400"
          }
        >
          Total Profit: ${totalProfit.toFixed(2)}
        </p>
      </div>
    </main>
  );
}