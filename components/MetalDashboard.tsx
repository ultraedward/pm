"use client";

import { useEffect, useState } from "react";
import PriceChart from "./PriceChart";

export type HistoryPoint = {
  price: number;
  timestamp: string;
};

export type MetalData = {
  price: number;
  percentChange: number;
  lastUpdated: string | null;
  history1D: HistoryPoint[];
  history7D: HistoryPoint[];
  history30D: HistoryPoint[];
};

type Props = {
  gold: MetalData;
  silver: MetalData;
};

function formatTimeAgo(dateString: string | null) {
  if (!dateString) return "No data";

  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Updated just now";
  if (diffMin === 1) return "Updated 1 min ago";
  if (diffMin < 60) return `Updated ${diffMin} min ago`;

  const diffHr = Math.floor(diffMin / 60);
  return `Updated ${diffHr}h ago`;
}

function MetalCard({
  metal,
  data,
}: {
  metal: "gold" | "silver";
  data: MetalData;
}) {
  const [timeAgo, setTimeAgo] = useState(
    formatTimeAgo(data.lastUpdated)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(data.lastUpdated));
    }, 60000);

    return () => clearInterval(interval);
  }, [data.lastUpdated]);

  const isUp = data.percentChange >= 0;
  const color =
    metal === "gold"
      ? isUp
        ? "text-yellow-400"
        : "text-red-400"
      : isUp
      ? "text-green-400"
      : "text-red-400";

  const history = data.history1D;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold capitalize">
            {metal}
          </h2>

          <div className="flex items-center gap-3 mt-1 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              LIVE
            </div>

            <span>{timeAgo}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold">
            ${data.price.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${color}`}>
            {isUp ? "▲" : "▼"} {Math.abs(data.percentChange).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <PriceChart data={history} metal={metal} />
    </div>
  );
}

export default function MetalDashboard({
  gold,
  silver,
}: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <MetalCard metal="gold" data={gold} />
      <MetalCard metal="silver" data={silver} />
    </div>
  );
}