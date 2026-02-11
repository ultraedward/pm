"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

type SparklineProps = {
  data: { value: number }[];
  isPositive: boolean;
};

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-black border border-gray-800 px-3 py-2 text-sm shadow-xl">
        <div className="text-white font-medium">
          ${payload[0].value.toFixed(2)}
        </div>
      </div>
    );
  }

  return null;
}

export function Sparkline({ data, isPositive }: SparklineProps) {
  const strokeColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div className="h-20 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#111"
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "#444",
              strokeWidth: 1,
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}