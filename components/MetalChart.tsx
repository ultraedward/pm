"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PricePoint = {
  timestamp: string;
  price: number;
};

export default function MetalChart() {
  const [data, setData] = useState<PricePoint[]>([]);
  const [metal, setMetal] = useState<"gold" | "silver">("gold");

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((json) => {
        const selected = json[metal];

        const formatted = selected.map((p: any) => ({
          timestamp: new Date(p.timestamp).toLocaleDateString(),
          price: p.price,
        }));

        setData(formatted);
      });
  }, [metal]);

  return (
    <div className="w-full h-[400px] bg-black p-6 rounded-xl">
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setMetal("gold")}
          className={`px-4 py-2 rounded ${
            metal === "gold" ? "bg-yellow-500 text-black" : "bg-gray-700"
          }`}
        >
          Gold
        </button>

        <button
          onClick={() => setMetal("silver")}
          className={`px-4 py-2 rounded ${
            metal === "silver" ? "bg-gray-300 text-black" : "bg-gray-700"
          }`}
        >
          Silver
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke={metal === "gold" ? "#facc15" : "#cbd5e1"}
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}