export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

async function getLatestPrice(metal: "gold" | "silver") {
  return prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });
}

export default async function HoldingsPage() {
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

  const holdings = await prisma.holding.findMany({
    where: { userId: user.id },
    orderBy: { purchaseDate: "desc" },
  });

  const goldPrice = await getLatestPrice("gold");
  const silverPrice = await getLatestPrice("silver");

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Holdings</h1>
          <Link
            href="/dashboard"
            className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {holdings.length === 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            No holdings yet.
          </div>
        )}

        {holdings.map((h) => {
          const currentPrice =
            h.metal === "gold"
              ? goldPrice?.price ?? 0
              : silverPrice?.price ?? 0;

          const currentValue = h.ounces * currentPrice;
          const invested = h.ounces * h.purchasePrice;
          const pnl = currentValue - invested;
          const pnlPercent =
            invested > 0 ? (pnl / invested) * 100 : 0;

          return (
            <div
              key={h.id}
              className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-2"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold capitalize">
                    {h.metal}
                  </p>
                  <p className="text-sm text-gray-400">
                    {h.ounces.toFixed(2)} oz @ ${h.purchasePrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Purchased {new Date(h.purchaseDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold">
                    ${currentValue.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${
                      pnl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {pnl >= 0 ? "+" : ""}
                    ${pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}