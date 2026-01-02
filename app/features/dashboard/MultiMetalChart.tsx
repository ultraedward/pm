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

const METALS = ["Gold", "Silver", "Platinum", "Palladium"] as const;

type Metal = (typeof METALS)[number];

type Point = {
  time: string;
  [key: string]: number | string;
};

export default function MultiMetalChart({
  hours,
  enabled,
}: {
  hours: number;
  enabled: Record<Metal, boolean>;
}) {
  const [data, setData] = useState<Point[]>([]);

  useEffect(() => {
    async function load() {
      const responses = await Promise.all(
        METALS.map((metal) =>
          fetch(`/api/prices/history?metal=${metal}&hours=${hours}`)
            .then((r) => r.json())
            .then((d) => ({ metal, points: d.points || [] }))
        )
      );

      // Merge by timestamp
      const map = new Map<string, Point>();

      for (const { metal, points } of responses) {
        for (const p of points) {
          const key = p.time;
          if (!map.has(key)) map.set(key, { time: key });
          map.get(key)![metal] = p.price;
        }
      }

      setData(Array.from(map.values()).sort(
        (a, b) =>
          new Date(a.time).getTime() -
          new Date(b.time).getTime()
      ));
    }

    load();
  }, [hours]);

  return (
    <div style={{ width: "100%", height: 350 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={(v) =>
              new Date(v).toLocaleDateString(undefined, {
                hour: "numeric",
                minute: "numeric",
              })
            }
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={(v) => new Date(v).toLocaleString()}
          />

          {METALS.map(
            (metal) =>
              enabled[metal] && (
                <Line
                  key={metal}
                  type="monotone"
                  dataKey={metal}
                  strokeWidth={2}
                  dot={false}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
