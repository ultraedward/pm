"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

type HistoryPoint = {
  price: number;
  timestamp: string;
};

type MetalData = {
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

function PriceCard({
  metal,
  data,
}: {
  metal: "gold" | "silver";
  data: MetalData;
}) {
  const [timeframe, setTimeframe] = useState<"1D" | "7D" | "30D">("1D");

  const history =
    timeframe === "1D"
      ? data.history1D
      : timeframe === "7D"
      ? data.history7D
      : data.history30D;

  const isUp = data.percentChange >= 0;

  const gradientId = metal === "gold" ? "goldGradient" : "silverGradient";
  const strokeColor = metal === "gold" ? "#facc15" : "#cbd5e1";
  const fillColor = metal === "gold" ? "#facc15" : "#cbd5e1";

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">
          {metal}
        </h2>

        <div className="flex gap-2 text-xs">
          {(["1D", "7D", "30D"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`rounded px-2 py-1 ${
                timeframe === tf
                  ? "bg-white text-black"
                  : "bg-neutral-800 text-neutral-400"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mt-4">
        <div className="text-3xl font-bold">
          ${data.price.toFixed(2)}
        </div>

        <div
          className={`mt-1 text-sm font-medium ${
            isUp ? "text-green-400" : "text-red-400"
          }`}
        >
          {isUp ? "▲" : "▼"} {data.percentChange.toFixed(2)}%
        </div>

        {data.lastUpdated && (
          <p className="mt-2 text-xs text-neutral-500">
            Updated{" "}
            {new Date(data.lastUpdated).toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Chart */}
      <div className="mt-6 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient
                id={gradientId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={fillColor}
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor={fillColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="timestamp"
              hide
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111",
                border: "1px solid #333",
              }}
              formatter={(value: number) =>
                `$${value.toFixed(2)}`
              }
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              fill={`url(#${gradientId})`}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function MetalDashboard({
  gold,
  silver,
}: Props) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <PriceCard metal="gold" data={gold} />
      <PriceCard metal="silver" data={silver} />
    </div>
  );
}