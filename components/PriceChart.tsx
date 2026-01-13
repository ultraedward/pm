"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

export type Range = "24h" | "7d" | "30d";

type PricePoint = {
  t: number;
  price: number;
};

type Props = {
  metal: string;
  range: Range;
};

export default function PriceChart({ metal, range }: Props) {
  const [data, setData] = useState<PricePoint[]>([]);

  useEffect(() => {
    fetch(`/api/charts/prices?metal=${metal}&range=${range}`)
      .then(r => r.json())
      .then(res => {
        // defensive: always force array
        setData(Array.isArray(res) ? res : []);
      });
  }, [metal, range]);

  if (!data.length) {
    return (
      <div className="h-[320px] flex items-center justify-center text-gray-400">
        No data
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="t"
            tickFormatter={t =>
              new Date(t).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={l => new Date(Number(l)).toLocaleString()}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#000"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
