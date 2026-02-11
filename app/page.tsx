import Link from "next/link";
import { Sparkline } from "@/components/Sparkline";

async function getPrices() {
  // Replace with your real DB or API call
  return {
    gold: 2045.12,
    silver: 24.87,
  };
}

function generateMockData(base: number) {
  return Array.from({ length: 20 }).map((_, i) => ({
    value: base + Math.sin(i / 2) * 5 + Math.random() * 2,
  }));
}

export default async function HomePage() {
  const prices = await getPrices();

  const goldData = generateMockData(prices.gold);
  const silverData = generateMockData(prices.silver);

  return (
    <div className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.06),transparent_40%)]" />

      <div className="relative mx-auto max-w-6xl px-8 py-24 space-y-24">
        {/* HERO */}
        <div className="space-y-8 max-w-3xl">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight">
            Precious Metals.
            <br />
            <span className="text-gray-400">Under Control.</span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl">
            Track gold and silver prices in real time. Set alerts. Move when it matters.
          </p>

          <div className="flex gap-4">
            <Link
              href="/alerts/new"
              className="rounded-full bg-white px-6 py-3 text-black font-medium hover:bg-gray-200 transition"
            >
              Create Alert
            </Link>

            <Link
              href="/alerts"
              className="rounded-full border border-gray-700 px-6 py-3 text-white hover:border-gray-500 transition"
            >
              View Alerts
            </Link>
          </div>
        </div>

        {/* PRICES */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* GOLD */}
          <div className="space-y-6">
            <div className="text-sm tracking-widest text-gray-500">GOLD</div>

            <div className="text-5xl font-semibold">
              ${prices.gold.toFixed(2)}
            </div>

            <div className="text-gray-500 text-sm">Latest market price</div>

            <Sparkline data={goldData} />
          </div>

          {/* SILVER */}
          <div className="space-y-6">
            <div className="text-sm tracking-widest text-gray-500">SILVER</div>

            <div className="text-5xl font-semibold">
              ${prices.silver.toFixed(2)}
            </div>

            <div className="text-gray-500 text-sm">Latest market price</div>

            <Sparkline data={silverData} />
          </div>
        </div>

        {/* PLAN SECTION */}
        <div className="border-t border-gray-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-20">
            <div>
              <div className="text-sm text-gray-500 tracking-widest">PLAN</div>
              <div className="text-3xl font-semibold">FREE</div>
            </div>

            <div>
              <div className="text-sm text-gray-500 tracking-widest">
                ACTIVE ALERTS
              </div>
              <div className="text-3xl font-semibold">0</div>
            </div>
          </div>

          <Link
            href="/pricing"
            className="rounded-full bg-white px-8 py-3 text-black font-medium hover:bg-gray-200 transition"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}