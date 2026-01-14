"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type SeriesPoint = {
  time: string;
  [metal: string]: number | string;
};

export default function PriceChart() {
  const [data, setData] = useState<SeriesPoint[]>([]);
  const [metals, setMetals] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch("/api/dashboard/prices", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load prices");

        const json = await res.json();

        const grouped = json.data as Record<
          string,
          { time: string; price: number }[]
        >;

        const metalKeys = Object.keys(grouped);
        const timeMap: Record<string, SeriesPoint> = {};

        for (const metal of metalKeys) {
          for (const point of grouped[metal]) {
            if (!timeMap[point.time]) {
              timeMap[point.time] = { time: point.time };
            }
            timeMap[point.time][metal] = point.price;
          }
        }

        if (!alive) return;

        setMetals(metalKeys);
        setData(Object.values(timeMap));
      } catch (e: any) {
        if (!alive) return;
        setError(e.message ?? "Unknown error");
      }
    }

    load();
    const id = setInterval(load, 30_000);

    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  if (error) {
    return <div className="text-red-500">Chart error: {error}</div>;
  }

  if (!data.length) {
    return <div className="text-gray-500">Loading price chart…</div>;
  }

  return (
    <div className="h-[420px] w-full rounded-lg border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={(v) => new Date(v).toLocaleTimeString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(v) => new Date(v).toLocaleString()}
          />
          <Legend />
          {metals.map((metal) => (
            <Line
              key={metal}
              type="monotone"
              dataKey={metal}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
