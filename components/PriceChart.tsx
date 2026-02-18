"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type HistoryPoint = {
  price: number;
  timestamp: string;
};

type Props = {
  data: HistoryPoint[];
  metal: "gold" | "silver";
};

export default function PriceChart({ data, metal }: Props) {
  const strokeColor =
    metal === "gold" ? "#facc15" : "#94a3b8";

  const gradientId =
    metal === "gold" ? "goldGradient" : "silverGradient";

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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

          <XAxis
            dataKey="timestamp"
            hide
          />

          <Tooltip
            contentStyle={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#aaa" }}
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
  );
}