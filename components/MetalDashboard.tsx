"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

  const current = filtered.length
    ? filtered[filtered.length - 1].price
    : 0;

  const first = filtered.length ? filtered[0].price : 0;
  const changePercent =
    first !== 0 ? ((current - first) / first) * 100 : 0;

  const isUp = changePercent >= 0;

  return (
    <div className="panel p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold capitalize">
            {name}
          </h2>
          <div className="text-3xl font-bold mt-2">
            ${current.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          <div
            className={`text-sm font-medium mt-1 ${
              isUp ? "text-green-400" : "text-red-400"
            }`}
          >
            {isUp ? "▲" : "▼"} {changePercent.toFixed(2)}%
          </div>
        </div>

        <div className="flex gap-2 text-xs">
          {(["1D", "7D", "30D"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-full border ${
                range === r
                  ? "bg-white text-black"
                  : "border-gray-700 text-gray-400"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filtered}>
            <XAxis hide dataKey="timestamp" />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isUp ? "#22c55e" : "#ef4444"}
              strokeWidth={2}
              dot={false}
              isAnimationActive
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