// app/components/DashboardClient.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PricePoint = {
  time: string;
  price: number;
};

type MetalCardProps = {
  name: string;
  latestPrice: number;
  data: PricePoint[];
};

export function MetalCard({ name, latestPrice, data }: MetalCardProps) {
  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-gray-900">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{name}</h2>
        <span className="text-lg">${latestPrice.toFixed(2)}</span>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
