"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
} from "recharts";

type PricePoint = {
  price: number;
  timestamp: Date;
};

type Props = {
  goldHistory: PricePoint[];
  silverHistory: PricePoint[];
};

type Range = "1D" | "7D" | "30D";

function filterByRange(data: PricePoint[], range: Range) {
  if (!data.length) return [];

  const now = new Date();
  const cutoff = new Date(now);

  if (range === "1D") cutoff.setDate(now.getDate() - 1);
  if (range === "7D") cutoff.setDate(now.getDate() - 7);
  if (range === "30D") cutoff.setDate(now.getDate() - 30);

  return data.filter((d) => new Date(d.timestamp) >= cutoff);
}

function MetalCard({
  name,
  history,
  range,
  setRange,
}: {
  name: string;
  history: PricePoint[];
  range: Range;
  setRange: (r: Range) => void;
}) {
  const filtered = useMemo(
    () => filterByRange(history, range),
    [history, range]
  );

  const current =
    filtered.length > 0
      ? filtered[filtered.length - 1].price
      : 0;

  const first =
    filtered.length > 0 ? filtered[0].price : 0;

  const changePercent =
    first !== 0 ? ((current - first) / first) * 100 : 0;

  const isUp = changePercent >= 0;

  const gradientId = `${name}-gradient`;

  return (
    <div className="panel p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold capitalize">
            {name}
          </h2>

          <div className="text-3xl font-bold mt-2">
            ${current.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </div>

          <div
            className={`text-sm font-medium mt-1 ${
              isUp ? "text-green-400" : "text-red-400"
            }`}
          >
            {isUp ? "▲" : "▼"} {changePercent.toFixed(2)}%
          </div>
        </div>

        {/* Range Toggle */}
        <div className="flex gap-2 text-xs">
          {(["1D", "7D", "30D"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full border transition ${
                range === r
                  ? "bg-white text-black"
                  : "border-gray-700 text-gray-400 hover:border-gray-500"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered}>
            {/* Gradient */}
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={isUp ? "#22c55e" : "#ef4444"}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={isUp ? "#22c55e" : "#ef4444"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              vertical={false}
            />

            <XAxis hide dataKey="timestamp" />
            <YAxis hide domain={["auto", "auto"]} />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0b0b0b",
                border: "1px solid #1f1f1f",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: number) =>
                `$${value.toFixed(2)}`
              }
              labelFormatter={() => ""}
              cursor={{
                stroke: "#6b7280",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke="none"
              fill={`url(#${gradientId})`}
              isAnimationActive
              animationDuration={600}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke={isUp ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={600}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function MetalDashboard({
  goldHistory,
  silverHistory,
}: Props) {
  const [range, setRange] = useState<Range>("1D");

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <MetalCard
        name="gold"
        history={goldHistory}
        range={range}
        setRange={setRange}
      />
      <MetalCard
        name="silver"
        history={silverHistory}
        range={range}
        setRange={setRange}
      />
    </div>
  );
}