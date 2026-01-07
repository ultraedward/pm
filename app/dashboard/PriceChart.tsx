"use client";

import useSWR from "swr";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function PriceChart() {
  const { data, error } = useSWR("/api/dashboard/prices", fetcher, {
    refreshInterval: 30_000,
  });

  if (error) return <div className="text-red-500">Failed to load chart</div>;
  if (!data) return <div className="text-gray-500">Loading chart…</div>;

  const metals = Object.keys(data.data);

  // flatten into chart-friendly rows
  const chartData: any[] = [];
  const timeMap: Record<string, any> = {};

  for (const metal of metals) {
    for (const point of data.data[metal]) {
      if (!timeMap[point.time]) timeMap[point.time] = { time: point.time };
      timeMap[point.time][metal] = point.price;
    }
  }

  Object.values(timeMap).forEach((row) => chartData.push(row));

  return (
    <div className="h-[400px] w-full rounded-lg border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
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
