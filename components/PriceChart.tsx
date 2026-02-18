"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export type HistoryPoint = {
  price: number;
  timestamp: string;
};

type Props = {
  history1D: HistoryPoint[];
  history7D: HistoryPoint[];
  history30D: HistoryPoint[];
  metal: "gold" | "silver";
};

export default function PriceChart({
  history1D,
  history7D,
  history30D,
  metal,
}: Props) {
  // Default timeframe (1D)
  const data = history1D;

  const strokeColor =
    metal === "gold" ? "#facc15" : "#e5e7eb";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="#1f2937" strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(value) =>
            new Date(value).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
          stroke="#6b7280"
        />
        <YAxis
          domain={["auto", "auto"]}
          stroke="#6b7280"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            border: "1px solid #374151",
          }}
          labelFormatter={(value) =>
            new Date(value).toLocaleString()
          }
          formatter={(value: number) => [
            `$${value.toFixed(2)}`,
            metal.toUpperCase(),
          ]}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={2}
          dot={false}
          isAnimationActive
        />
      </LineChart>
    </ResponsiveContainer>
  );
}