"use client";

import { useState } from "react";
import PriceChart from "./PriceChart";
import AnimatedNumber from "./AnimatedNumber";

type HistoryPoint = {
  price: number;
  timestamp: string;
};

type MetalData = {
  price: number;
  percentChange: number | null;
  history1D: HistoryPoint[];
  history7D: HistoryPoint[];
  history30D: HistoryPoint[];
  lastUpdated: string;
};

type Props = {
  gold: MetalData;
  silver: MetalData;
  isPro: boolean;
};

export default function MetalDashboard({
  gold,
  silver,
  isPro,
}: Props) {
  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "30D">("1D");

  function renderCard(
    metal: "gold" | "silver",
    data: MetalData
  ) {
    const history =
      timeframe === "1D"
        ? data.history1D
        : timeframe === "7D"
        ? data.history7D
        : data.history30D;

    return (
      <div className="rounded-xl bg-neutral-900 p-6 space-y-4 border border-neutral-800">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold capitalize">
            {metal}
          </h2>
          <div className="text-right">
            <AnimatedNumber value={data.price} />
            <div className="text-sm text-neutral-400">
              Updated {new Date(data.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Timeframe Toggle */}
        <div className="flex gap-2">
          {(["1D", "7D", "30D"] as const).map((tf) => {
            const locked =
              !isPro && (tf === "7D" || tf === "30D");

            return (
              <button
                key={tf}
                disabled={locked}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-sm ${
                  timeframe === tf
                    ? "bg-white text-black"
                    : "bg-neutral-800 text-neutral-300"
                } ${locked ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                {tf}
              </button>
            );
          })}
        </div>

        {!isPro && timeframe !== "1D" ? (
          <div className="p-6 text-center bg-neutral-800 rounded-lg">
            <p className="text-neutral-300 mb-3">
              7D and 30D charts are a Pro feature.
            </p>
            <a
              href="/pricing"
              className="inline-block px-4 py-2 bg-yellow-500 text-black rounded"
            >
              Upgrade to Pro
            </a>
          </div>
        ) : (
          <PriceChart data={history} metal={metal} />
        )}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {renderCard("gold", gold)}
      {renderCard("silver", silver)}
    </div>
  );
}