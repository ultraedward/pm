"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

type SparklineProps = {
  data: { value: number }[];
};

export function Sparkline({ data }: SparklineProps) {
  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}