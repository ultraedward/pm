"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useState } from "react";

type PricePoint = {
  timestamp: string;
  price: number;
};

type MetalCardProps = {
  name: "gold" | "silver";
  label: string;
  price: number;
  percentChange: number;
  history1D: PricePoint[];
  history7D: PricePoint[];
  history30D: PricePoint[];
};

function MetalCard({
  name,
  label,
  price,
  percentChange,
  history1D,
  history7D,
  history30D,
}: MetalCardProps) {
  const [range, setRange] = useState<"1D" | "7D" | "30D">("1D");

  const history =
    range === "1D"
      ? history1D
      : range === "7D"
      ? history7D
      : history30D;

  const isUp = percentChange >= 0;

  // 🎨 Distinct metal styling
  const strokeColor =
    name === "gold" ? "#d4af37" : "#cfd2d6";

  const glowColor =
    name === "gold"
      ? "rgba(212,175,55,0.25)"
      : "rgba(207,210,214,0.25)";

  const gradientId = `${name}-gradient`;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-black p-8 space-y-6 transition hover:border-neutral-700 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold capitalize">
            {label}
          </h2>

          <div className="text-4xl font-bold mt-2 tracking-tight">
            ${price.toLocaleString()}
          </div>

          <div
            className={`mt-2 text-sm font-medium ${
              isUp ? "text-green-500" : "text-red-500"
            }`}
          >
            {isUp ? "▲" : "▼"} {percentChange.toFixed(2)}%
          </div>
        </div>

        {/* Range Toggle */}
        <div className="flex gap-2">
          {["1D", "7D", "30D"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as any)}
              className={`px-3 py-1 text-xs rounded-full border transition ${
                range === r
                  ? "bg-white text-black border-white"
                  : "border-neutral-700 text-neutral-400 hover:border-neutral-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 relative">
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
                  stopColor={strokeColor}
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor={strokeColor}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              vertical={false}
            />

            <XAxis
              dataKey="timestamp"
              tick={false}
              axisLine={false}
            />

            <YAxis
              domain={["auto", "auto"]}
              tick={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#999" }}
              formatter={(value: number) => [
                `$${value.toFixed(2)}`,
                label,
              ]}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Subtle Metal Glow */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            boxShadow: `0 0 60px ${glowColor}`,
          }}
        />
      </div>
    </div>
  );
}

export default function MetalDashboard({
  gold,
  silver,
}: {
  gold: {
    price: number;
    percentChange: number;
    history1D: PricePoint[];
    history7D: PricePoint[];
    history30D: PricePoint[];
  };
  silver: {
    price: number;
    percentChange: number;
    history1D: PricePoint[];
    history7D: PricePoint[];
    history30D: PricePoint[];
  };
}) {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <MetalCard
        name="gold"
        label="Gold (XAU)"
        price={gold.price}
        percentChange={gold.percentChange}
        history1D={gold.history1D}
        history7D={gold.history7D}
        history30D={gold.history30D}
      />

      <MetalCard
        name="silver"
        label="Silver (XAG)"
        price={silver.price}
        percentChange={silver.percentChange}
        history1D={silver.history1D}
        history7D={silver.history7D}
        history30D={silver.history30D}
      />
    </div>
  );
}