import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getMetalData(metal: "gold" | "silver") {
  const latest = await prisma.price.findFirst({
    where: { metal },
    orderBy: { timestamp: "desc" },
  });

  if (!latest) return null;

  const yesterday = await prisma.price.findFirst({
    where: {
      metal,
      timestamp: {
        lte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { timestamp: "desc" },
  });

  let changePercent = 0;

  if (yesterday) {
    changePercent =
      ((latest.price - yesterday.price) / yesterday.price) * 100;
  }

  return {
    price: latest.price,
    changePercent,
  };
}

function formatPercent(num: number) {
  return `${num >= 0 ? "▲" : "▼"} ${Math.abs(num).toFixed(2)}%`;
}

export default async function HomePage() {
  const gold = await getMetalData("gold");
  const silver = await getMetalData("silver");

  return (
    <main className="min-h-screen bg-black text-white px-8 py-16">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-6xl font-bold tracking-tight mb-6">
          Track metals.<br />
          <span className="text-zinc-400">Move when it matters.</span>
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Live gold and silver pricing. Intelligent alerts. Clean execution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16">

          {/* GOLD */}
          <div>
            <p className="text-zinc-500 uppercase tracking-wider mb-2">
              Gold (XAU)
            </p>

            <div className="flex items-center gap-4">
              <p className="text-5xl font-semibold">
                ${gold?.price.toFixed(2) ?? "0.00"}
              </p>

              {gold && (
                <span
                  className={`text-sm font-medium ${
                    gold.changePercent >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPercent(gold.changePercent)}
                </span>
              )}
            </div>

            <p className="text-zinc-500 mt-2 text-sm">
              24h change
            </p>
          </div>

          {/* SILVER */}
          <div>
            <p className="text-zinc-500 uppercase tracking-wider mb-2">
              Silver (XAG)
            </p>

            <div className="flex items-center gap-4">
              <p className="text-5xl font-semibold">
                ${silver?.price.toFixed(2) ?? "0.00"}
              </p>

              {silver && (
                <span
                  className={`text-sm font-medium ${
                    silver.changePercent >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatPercent(silver.changePercent)}
                </span>
              )}
            </div>

            <p className="text-zinc-500 mt-2 text-sm">
              24h change
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}