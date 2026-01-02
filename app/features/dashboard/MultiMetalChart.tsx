"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const METALS = ["Gold", "Silver", "Platinum", "Palladium"] as const;
type Metal = (typeof METALS)[number];

type Point = {
  time: string;
  [key: string]: number | string;
};

type AlertLine = {
  id: string;
  threshold: number;
  direction: "above" | "below";
};

export default function MultiMetalChart({
  hours,
  enabled,
}: {
  hours: number;
  enabled: Record<Metal, boolean>;
}) {
  const [data, setData] = useState<Point[]>([]);
  const [alerts, setAlerts] = useState<Record<Metal, AlertLine[]>>({
    Gold: [],
    Silver: [],
    Platinum: [],
    Palladium: [],
  });

  useEffect(() => {
    async function loadPrices() {
      const responses = await Promise.all(
        METALS.map((metal) =>
          fetch(`/api/prices/history?metal=${metal}&hours=${hours}`)
            .then((r) => r.json())
            .then((d) => ({ metal, points: d.points || [] }))
        )
      );

      const map = new Map<string, Point>();

      for (const { metal, points } of responses) {
        for (const p of points) {
          if (!map.has(p.time)) map.set(p.time, { time: p.time });
          map.get(p.time)![metal] = p.price;
        }
      }

      setData(
        Array.from(map.values()).sort(
          (a, b) =>
            new Date(a.time).getTime() -
            new Date(b.time).getTime()
        )
      );
    }

    loadPrices();
  }, [hours]);

  useEffect(() => {
    async function loadAlerts() {
      const results = await Promise.all(
        METALS.map((metal) =>
          fetch(`/api/alerts/by-metal?metal=${metal}`)
            .then((r) => r.json())
            .then((d) => ({ metal, alerts: d.alerts || [] }))
        )
      );

      const next: Record<Metal, AlertLine[]> = {
        Gold: [],
        Silver: [],
        Platinum: [],
        Palladium: [],
      };

      for (const r of results) {
        next[r.metal as Metal] = r.alerts;
      }

      setAlerts(next);
    }

    loadAlerts();
  }, []);

  return (
    <div style={{ width: "100%", height: 360 }}>
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

          {/* Price lines */}
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

          {/* Alert thresholds */}
          {METALS.map(
            (metal) =>
              enabled[metal] &&
              alerts[metal].map((alert) => (
                <ReferenceLine
                  key={`${metal}-${alert.id}`}
                  y={alert.threshold}
                  stroke={
                    alert.direction === "above"
                      ? "#16a34a"
                      : "#dc2626"
                  }
                  strokeDasharray="4 4"
                  label={{
                    value: `${metal} ${alert.direction} ${alert.threshold}`,
                    position: "right",
                    fontSize: 11,
                    fill:
                      alert.direction === "above"
                        ? "#16a34a"
                        : "#dc2626",
                  }}
                />
              ))
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
