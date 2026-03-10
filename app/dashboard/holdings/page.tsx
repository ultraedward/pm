import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function getLatestPrice(metal: string) {
  return prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });
}

/* ============================= */
/*        SERVER ACTIONS         */
/* ============================= */

async function addHolding(formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return;

  const metal = formData.get("metal") as string;
  const ounces = Number(formData.get("ounces"));
  const purchasePrice = Number(formData.get("purchasePrice"));
  const purchaseDate = new Date(formData.get("purchaseDate") as string);

  if (!metal || !ounces || !purchasePrice || !purchaseDate) return;

  await prisma.holding.create({
    data: {
      userId: user.id,
      metal,
      ounces,
      purchasePrice,
      purchaseDate,
    },
  });

  revalidatePath("/dashboard/holdings");
}

async function deleteHolding(id: string) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return;

  await prisma.holding.deleteMany({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/holdings");
}

/* ============================= */
/*            PAGE               */
/* ============================= */

export default async function HoldingsPage() {
  const session = await getServerSession(authOptions);

  /* ============================= */
  /*        DEBUG BLOCK            */
  /* ============================= */

  if (!session) {
    return (
      <pre className="p-10 text-white">
        {JSON.stringify(session, null, 2)}
      </pre>
    );
  }

  if (!session.user?.email) {
    return (
      <pre className="p-10 text-white">
        {JSON.stringify(session, null, 2)}
      </pre>
    );
  }

  /* ============================= */
  /*        NORMAL FLOW            */
  /* ============================= */

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return (
      <div className="p-10 text-white">
        User not found
      </div>
    );
  }

  const holdings = await prisma.holding.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const [goldPrice, silverPrice] = await Promise.all([
    getLatestPrice("gold"),
    getLatestPrice("silver"),
  ]);

  const [goldHistory, silverHistory] = await Promise.all([
    prisma.price.findMany({
      where: { metal: "gold" },
      orderBy: { timestamp: "asc" },
      take: 30,
    }),
    prisma.price.findMany({
      where: { metal: "silver" },
      orderBy: { timestamp: "asc" },
      take: 30,
    }),
  ]);

  const totalInvested = holdings.reduce((sum, h) => {
    return sum + h.ounces * h.purchasePrice;
  }, 0);

  const totalValue = holdings.reduce((sum, h) => {
    const currentPrice =
      h.metal === "gold"
        ? goldPrice?.price ?? 0
        : silverPrice?.price ?? 0;

    return sum + h.ounces * currentPrice;
  }, 0);

  const totalGainLoss = totalValue - totalInvested;

  const totalPercent =
    totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const goldValue = holdings
    .filter((h) => h.metal === "gold")
    .reduce((sum, h) => sum + h.ounces * (goldPrice?.price ?? 0), 0);

  const silverValue = holdings
    .filter((h) => h.metal === "silver")
    .reduce((sum, h) => sum + h.ounces * (silverPrice?.price ?? 0), 0);

  const goldPercent = totalValue > 0 ? (goldValue / totalValue) * 100 : 0;
  const silverPercent = totalValue > 0 ? (silverValue / totalValue) * 100 : 0;

  const portfolioHistory = goldHistory.map((g, i) => {
    const s = silverHistory[i];
    const goldOunces = holdings
      .filter((h) => h.metal === "gold")
      .reduce((sum, h) => sum + h.ounces, 0);

    const silverOunces = holdings
      .filter((h) => h.metal === "silver")
      .reduce((sum, h) => sum + h.ounces, 0);

    const value =
      goldOunces * (g?.price ?? 0) +
      silverOunces * (s?.price ?? 0);

    return value;
  });

  const maxValue = Math.max(...portfolioHistory, 1);

  const points =
    portfolioHistory.length > 1
      ? portfolioHistory
          .map((v, i) => {
            const x = (i / (portfolioHistory.length - 1)) * 100;
            const y = 100 - (v / maxValue) * 100;
            return `${x},${y}`;
          })
          .join(" ")
      : "0,100 100,100";

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <div className="mx-auto max-w-5xl space-y-10">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Holdings</h1>
          <Link
            href="/dashboard"
            className="rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-4 text-lg font-semibold">Portfolio Performance</h2>

          <div className="h-40 w-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <polyline
                fill="none"
                stroke="#22c55e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>

          <div className="mt-2 text-sm text-gray-400">
            Last 30 price updates
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
          <h2 className="mb-4 text-lg font-semibold">Portfolio Allocation</h2>

          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-yellow-400">Gold</span>
                <span>{goldPercent.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded bg-gray-800">
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${goldPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-300">Silver</span>
                <span>{silverPercent.toFixed(1)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded bg-gray-800">
                <div
                  className="h-full bg-gray-400"
                  style={{ width: `${silverPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="relative h-40 w-40">
              <div
                className="h-full w-full rounded-full"
                style={{
                  background: `conic-gradient(#facc15 0% ${goldPercent}%, #9ca3af ${goldPercent}% 100%)`
                }}
              />
              <div className="absolute inset-4 flex items-center justify-center rounded-full bg-gray-950 text-sm text-gray-300">
                {goldPercent.toFixed(0)} / {silverPercent.toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Add Holding</h2>

          <form action={addHolding} className="grid gap-4 md:grid-cols-4">
            <select
              name="metal"
              required
              className="rounded bg-gray-900 border border-gray-700 px-3 py-2"
            >
              <option value="">Select Metal</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>

            <input
              name="ounces"
              type="number"
              step="0.01"
              placeholder="Ounces"
              required
              className="rounded bg-gray-900 border border-gray-700 px-3 py-2"
            />

            <input
              name="purchasePrice"
              type="number"
              step="0.01"
              placeholder="Price per oz"
              required
              className="rounded bg-gray-900 border border-gray-700 px-3 py-2"
            />

            <input
              name="purchaseDate"
              type="date"
              required
              className="rounded bg-gray-900 border border-gray-700 px-3 py-2"
            />

            <button
              type="submit"
              className="md:col-span-4 rounded bg-green-600 py-2 hover:bg-green-500"
            >
              Add Holding
            </button>
          </form>
        </div>

        {holdings.length === 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-gray-400">No holdings yet.</p>
          </div>
        )}

        <div className="grid gap-6">
          {holdings.map((h) => {
            const currentPrice =
              h.metal === "gold"
                ? goldPrice?.price ?? 0
                : silverPrice?.price ?? 0;

            const value = h.ounces * currentPrice;
            const invested = h.ounces * h.purchasePrice;
            const gainLoss = value - invested;
            const percent =
              invested > 0 ? (gainLoss / invested) * 100 : 0;

            return (
              <div
                key={h.id}
                className="rounded-xl border border-gray-800 bg-gray-950 p-6 space-y-4"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold capitalize">
                      {h.metal}
                    </p>
                    <p className="text-sm text-gray-400">
                      {h.ounces.toFixed(2)} oz @ $
                      {h.purchasePrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Purchased{" "}
                      {new Date(h.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      ${value.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${
                        gainLoss >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {gainLoss >= 0 ? "+" : ""}
                      ${gainLoss.toFixed(2)} (
                      {percent.toFixed(2)}%)
                    </p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded bg-gray-800">
                      <div
                        className={`h-full ${
                          percent >= 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(Math.abs(percent), 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <form action={deleteHolding.bind(null, h.id)}>
                  <button
                    type="submit"
                    className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-500"
                  >
                    Delete
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}