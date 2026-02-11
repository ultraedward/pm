import Link from "next/link";
import { getMetalHistory } from "@/lib/prices/getMetalHistory";
import { Sparkline } from "@/components/Sparkline";

export default async function HomePage() {
  const goldHistory = await getMetalHistory("gold");
  const silverHistory = await getMetalHistory("silver");

  const goldLatest =
    goldHistory.length > 0
      ? goldHistory[goldHistory.length - 1].value
      : 0;

  const silverLatest =
    silverHistory.length > 0
      ? silverHistory[silverHistory.length - 1].value
      : 0;

  const goldStart =
    goldHistory.length > 0 ? goldHistory[0].value : 0;

  const silverStart =
    silverHistory.length > 0 ? silverHistory[0].value : 0;

  const goldPositive = goldLatest >= goldStart;
  const silverPositive = silverLatest >= silverStart;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-16">
      {/* HERO */}
      <section className="space-y-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          Track metals.
          <br />
          Move when it matters.
        </h1>

        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Live gold and silver pricing. Intelligent alerts.
          Clean execution.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/alerts"
            className="rounded bg-white px-6 py-3 text-sm font-medium text-black hover:bg-gray-200 transition"
          >
            View Alerts
          </Link>

          <Link
            href="/pricing"
            className="rounded border border-gray-700 px-6 py-3 text-sm text-gray-300 hover:bg-gray-800 transition"
          >
            View Plans
          </Link>
        </div>
      </section>

      {/* METALS CARDS */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* GOLD */}
        <div className="panel p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">Gold (XAU)</div>
              <div className="text-3xl font-bold">
                ${goldLatest.toFixed(2)}
              </div>
            </div>

            <span
              className={`text-sm font-medium ${
                goldPositive
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {goldPositive ? "▲ Up" : "▼ Down"}
            </span>
          </div>

          <Sparkline
            data={goldHistory}
            isPositive={goldPositive}
          />
        </div>

        {/* SILVER */}
        <div className="panel p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">Silver (XAG)</div>
              <div className="text-3xl font-bold">
                ${silverLatest.toFixed(2)}
              </div>
            </div>

            <span
              className={`text-sm font-medium ${
                silverPositive
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {silverPositive ? "▲ Up" : "▼ Down"}
            </span>
          </div>

          <Sparkline
            data={silverHistory}
            isPositive={silverPositive}
          />
        </div>
      </section>
    </div>
  );
}