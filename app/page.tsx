import { PrismaClient } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

async function getLatestPrice(metal: "gold" | "silver") {
  try {
    const row = await prisma.price.findFirst({
      where: { metal },
      orderBy: { timestamp: "desc" },
    });

    return row?.price ?? 0;
  } catch (err) {
    console.error("Failed to fetch latest price:", err);
    return 0;
  }
}

async function getHistory(metal: "gold" | "silver") {
  try {
    return await prisma.price.findMany({
      where: { metal },
      orderBy: { timestamp: "asc" },
      take: 24,
    });
  } catch (err) {
    console.error("Failed to fetch metal history:", err);
    return [];
  }
}

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-16 w-full"
    >
      <polyline
        fill="none"
        stroke="white"
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}

export default async function HomePage() {
  const goldPrice = await getLatestPrice("gold");
  const silverPrice = await getLatestPrice("silver");

  const goldHistoryRows = await getHistory("gold");
  const silverHistoryRows = await getHistory("silver");

  const goldHistory = goldHistoryRows.map((r) => r.price);
  const silverHistory = silverHistoryRows.map((r) => r.price);

  return (
    <main className="min-h-screen bg-black text-white px-8 py-16">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <section className="mb-20">
          <h1 className="text-6xl font-bold tracking-tight mb-6">
            Track metals.
            <br />
            <span className="text-gray-400">
              Move when it matters.
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl mb-8">
            Live gold and silver pricing. Intelligent alerts. Clean execution.
          </p>

          <div className="flex gap-4">
            <Link
              href="/alerts"
              className="bg-white text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
            >
              View Alerts
            </Link>

            <Link
              href="/pricing"
              className="border border-gray-600 px-6 py-3 rounded-full hover:bg-gray-900 transition"
            >
              View Plans
            </Link>
          </div>
        </section>

        {/* METAL CARDS */}
        <section className="grid md:grid-cols-2 gap-16 mb-16">
          {/* GOLD */}
          <div>
            <div className="text-sm tracking-widest text-gray-500 mb-2">
              Gold (XAU)
            </div>

            <div className="text-4xl font-bold mb-2">
              ${goldPrice.toFixed(2)}
            </div>

            <div className="text-gray-500 text-sm mb-4">
              Latest market price
            </div>

            <Sparkline data={goldHistory} />
          </div>

          {/* SILVER */}
          <div>
            <div className="text-sm tracking-widest text-gray-500 mb-2">
              Silver (XAG)
            </div>

            <div className="text-4xl font-bold mb-2">
              ${silverPrice.toFixed(2)}
            </div>

            <div className="text-gray-500 text-sm mb-4">
              Latest market price
            </div>

            <Sparkline data={silverHistory} />
          </div>
        </section>

        <hr className="border-gray-800 mb-12" />

        {/* PLAN SUMMARY */}
        <section className="flex justify-between items-center">
          <div>
            <div className="text-sm tracking-widest text-gray-500">
              PLAN
            </div>
            <div className="text-2xl font-semibold">
              FREE
            </div>
          </div>

          <div>
            <div className="text-sm tracking-widest text-gray-500">
              ACTIVE ALERTS
            </div>
            <div className="text-2xl font-semibold">
              0
            </div>
          </div>

          <Link
            href="/pricing"
            className="bg-white text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            Upgrade to Pro
          </Link>
        </section>

      </div>
    </main>
  );
}