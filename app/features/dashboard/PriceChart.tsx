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

type Point = { time: string; price: number };

export default function PriceChart({
  metal,
  hours = 48,
}: {
  metal: string;
  hours?: number;
}) {
  const [data, setData] = useState<Point[]>([]);

  useEffect(() => {
    fetch(`/api/prices/history?metal=${metal}&hours=${hours}`)
      .then((r) => r.json())
      .then((d) => setData(d.points || []));
  }, [metal, hours]);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={(v) => new Date(v).toLocaleTimeString()}
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={(v) => new Date(v).toLocaleString()}
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
  );
}
