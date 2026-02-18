"use client";

import { useEffect, useState } from "react";
import AnimatedNumber from "@/components/AnimatedNumber";
import PriceChart from "@/components/PriceChart";
import Link from "next/link";

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
    <div className="grid gap-10 md:grid-cols-2">
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
  const [timeframe, setTimeframe] =
    useState<"1D" | "7D" | "30D">("1D");
  const [flash, setFlash] =
    useState<"up" | "down" | null>(null);
  const [previousPrice, setPreviousPrice] =
    useState(data.price);

  useEffect(() => {
    if (data.price > previousPrice) {
      setFlash("up");
    } else if (data.price < previousPrice) {
      setFlash("down");
    }

    const timeout = setTimeout(() => setFlash(null), 800);
    setPreviousPrice(data.price);

    return () => clearTimeout(timeout);
  }, [data.price, previousPrice]);

  const history =
    timeframe === "1D"
      ? data.history1D
      : timeframe === "7D"
      ? data.history7D
      : data.history30D;

  const isUp =
    data.percentChange !== null &&
    data.percentChange >= 0;

  const percentColor =
    data.percentChange === null
      ? "text-gray-400"
      : isUp
      ? "text-green-400"
      : "text-red-400";

  const glowClass =
    flash === "up"
      ? "shadow-[0_0_25px_rgba(34,197,94,0.4)]"
      : flash === "down"
      ? "shadow-[0_0_25px_rgba(239,68,68,0.4)]"
      : "";

  return (
    <div
      className={`rounded-2xl border border-gray-800 bg-black p-6 transition-all ${glowClass}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {metal === "gold"
              ? "Gold (XAU)"
              : "Silver (XAG)"}
          </h2>

          <div className="mt-2 text-4xl font-bold">
            $
            <AnimatedNumber
              value={data.price}
              decimals={3}
            />
          </div>

          <div className={`mt-2 text-sm ${percentColor}`}>
            {data.percentChange === null
              ? "—"
              : `${isUp ? "▲" : "▼"} ${Math.abs(
                  data.percentChange
                ).toFixed(2)}%`}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Updated{" "}
            {new Date(
              data.lastUpdated
            ).toLocaleTimeString()}
          </div>
        </div>

        <div className="flex gap-2">
          {(["1D", "7D", "30D"] as const).map((tf) => {
            const locked =
              tf === "30D" && !isPro;

            return (
              <button
                key={tf}
                disabled={locked}
                onClick={() => setTimeframe(tf)}
                className={`rounded-full px-3 py-1 text-xs ${
                  timeframe === tf
                    ? "bg-white text-black"
                    : "border border-gray-700 text-gray-400"
                } ${
                  locked
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
              >
                {tf}
                {locked && " 🔒"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        {timeframe === "30D" && !isPro ? (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6 text-center">
            <p className="text-sm text-yellow-400">
              30-day history is a Pro feature.
            </p>
            <Link
              href="/pricing"
              className="mt-3 inline-block rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400"
            >
              Upgrade to Pro
            </Link>
          </div>
        ) : (
          <PriceChart
            data={history}
            metal={metal}
          />
        )}
      </div>
    </div>
  );
}