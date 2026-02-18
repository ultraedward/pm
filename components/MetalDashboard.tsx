"use client";

import { useState } from "react";
import PriceChart from "@/components/PriceChart";

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
  return (
    <div className="space-y-12">
      <MetalCard metal="gold" data={gold} isPro={isPro} />
      <MetalCard metal="silver" data={silver} isPro={isPro} />
    </div>
  );
}

function MetalCard({
  metal,
  data,
  isPro,
}: {
  metal: "gold" | "silver";
  data: MetalData;
  isPro: boolean;
}) {
  const [timeframe, setTimeframe] = useState<
    "1D" | "7D" | "30D"
  >("1D");

  const percent = data.percentChange;
  const isUp = percent !== null && percent >= 0;

  let history: HistoryPoint[] = data.history1D;

  if (timeframe === "7D") history = data.history7D;
  if (timeframe === "30D") history = data.history30D;

  const locked = !isPro && timeframe !== "1D";

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold capitalize">
            {metal}
          </h2>
          <p className="text-neutral-400 text-sm">
            Last updated:{" "}
            {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold">
            ${data.price.toFixed(2)}
          </div>

          {percent !== null ? (
            <div
              className={`text-sm font-medium ${
                isUp
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {isUp ? "▲" : "▼"}{" "}
              {Math.abs(percent).toFixed(2)}%
            </div>
          ) : (
            <div className="text-sm text-neutral-500">
              —
            </div>
          )}
        </div>
      </div>

      {/* Timeframe Toggle */}
      <div className="mt-6 flex gap-3">
        {["1D", "7D", "30D"].map((tf) => {
          const disabled = !isPro && tf !== "1D";

          return (
            <button
              key={tf}
              onClick={() =>
                !disabled &&
                setTimeframe(
                  tf as "1D" | "7D" | "30D"
                )
              }
              disabled={disabled}
              className={`rounded px-4 py-2 text-sm font-medium transition ${
                timeframe === tf
                  ? "bg-yellow-500 text-black"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              } ${
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
            >
              {tf}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="relative mt-6">
        <div className={locked ? "blur-sm" : ""}>
          <PriceChart
            data={history}
            metal={metal}
          />
        </div>

        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl text-center px-6">
            <p className="text-lg font-semibold text-white">
              Unlock Advanced Trend Analysis
            </p>
            <p className="mt-2 text-sm text-neutral-300">
              Upgrade to Pro to access 7D and 30D
              historical charts.
            </p>
            <a
              href="/pricing"
              className="mt-4 rounded bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-400 transition"
            >
              Upgrade to Pro
            </a>
          </div>
        )}
      </div>
    </div>
  );
}