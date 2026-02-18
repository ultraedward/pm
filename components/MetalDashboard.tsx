"use client";

import { useState } from "react";
import Link from "next/link";
import PriceChart from "@/components/PriceChart";
import AnimatedNumber from "@/components/AnimatedNumber";

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
    <div className="space-y-16">
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
  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "30D">("1D");

  const history =
    timeframe === "1D"
      ? data.history1D
      : timeframe === "7D"
      ? data.history7D
      : data.history30D;

  const isLocked = !isPro && timeframe !== "1D";

  const isUp =
    data.percentChange !== null && data.percentChange >= 0;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold capitalize">
            {metal}
          </h2>

          <div className="mt-3 flex items-baseline gap-4">
            <AnimatedNumber
              value={data.price}
              decimals={2}
              className="text-3xl font-bold"
            />

            {data.percentChange !== null && (
              <span
                className={`text-sm font-medium ${
                  isUp
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {isUp ? "▲" : "▼"}{" "}
                {Math.abs(data.percentChange).toFixed(2)}%
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-neutral-500">
            Updated{" "}
            {new Date(
              data.lastUpdated
            ).toLocaleTimeString()}
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex gap-2">
          {["1D", "7D", "30D"].map((tf) => (
            <button
              key={tf}
              onClick={() =>
                setTimeframe(
                  tf as "1D" | "7D" | "30D"
                )
              }
              className={`rounded px-3 py-1 text-sm ${
                timeframe === tf
                  ? "bg-yellow-500 text-black"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="relative mt-8">
        <PriceChart data={history} metal={metal} />

        {/* 🔒 Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/70 backdrop-blur-sm text-center">
            <p className="text-lg font-semibold">
              🔒 Unlock 7D & 30D Trends
            </p>
            <p className="mt-2 max-w-sm text-sm text-neutral-400">
              Understand market direction — not just
              intraday movement.
            </p>

            <Link
              href="/pricing"
              className="mt-4 rounded bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-400"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}