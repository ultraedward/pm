"use client";

import { useState } from "react";
import PriceChart from "./PriceChart";

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
};

export default function MetalDashboard({
  gold,
  silver,
}: {
  gold: MetalData;
  silver: MetalData;
}) {
  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
      <MetalCard metal="gold" label="Gold (XAU)" data={gold} />
      <MetalCard metal="silver" label="Silver (XAG)" data={silver} />
    </div>
  );
}

function MetalCard({
  metal,
  label,
  data,
}: {
  metal: "gold" | "silver";
  label: string;
  data: MetalData;
}) {
  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "30D">("1D");

  const history =
    timeframe === "1D"
      ? data.history1D
      : timeframe === "7D"
      ? data.history7D
      : data.history30D;

  const percent = data.percentChange;

  const isUp = typeof percent === "number" && percent > 0;
  const isDown = typeof percent === "number" && percent < 0;

  const color =
    percent === null
      ? "text-gray-400"
      : isUp
      ? "text-green-400"
      : isDown
      ? "text-red-400"
      : "text-gray-300";

  const accent =
    metal === "gold"
      ? "from-yellow-500/20 via-yellow-500/10 to-transparent"
      : "from-gray-400/20 via-gray-400/10 to-transparent";

  return (
    <div className="rounded-2xl border border-gray-800 bg-black p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{label}</h2>

        <div className="flex gap-2">
          {(["1D", "7D", "30D"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                timeframe === tf
                  ? "bg-white text-black"
                  : "border border-gray-700 text-gray-400 hover:bg-gray-900"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mt-4 text-4xl font-bold tracking-tight">
        ${data.price.toLocaleString(undefined, { maximumFractionDigits: 3 })}
      </div>

      {/* Percent Change */}
      <div className={`mt-2 text-sm font-medium ${color}`}>
        {percent === null ? (
          "—"
        ) : (
          <>
            {isUp && "▲ "}
            {isDown && "▼ "}
            {percent.toFixed(2)}%
          </>
        )}
      </div>

      {/* Chart */}
      <div
        className={`mt-6 rounded-xl bg-gradient-to-b ${accent} p-4`}
      >
        <PriceChart
          data={history}
          metal={metal}
        />
      </div>
    </div>
  );
}