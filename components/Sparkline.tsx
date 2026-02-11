"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

type SparklineProps = {
  data: { value: number }[];
  isPositive: boolean;
};

export function Sparkline({ data, isPositive }: SparklineProps) {
  const strokeColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}