// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type SpotPrice = {
  id: string;
  metal: string;
  price: number;
  createdAt: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<SpotPrice[]>([]);
  const [range, setRange] = useState<"24h" | "7d" | "30d">("24h");

  useEffect(() => {
    fetch(`/api/prices/history?range=${range}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [range]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Spot Price History</h1>
        <div className="flex gap-2">
          {(["24h", "7d", "30d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded text-sm ${
                range === r
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[420px] w-full bg-white rounded-xl border p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="createdAt"
              tickFormatter={(v) =>
                new Date(v).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              formatter={(v: number) => `$${v.toFixed(2)}`}
              labelFormatter={(l) =>
                new Date(l).toLocaleString()
              }
            />
            <Line
              type="monotone"
              dataKey="price"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
