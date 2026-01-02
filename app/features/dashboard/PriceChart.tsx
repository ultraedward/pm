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

type Point = {
  time: string;
  price: number;
};

type AlertLine = {
  id: string;
  threshold: number;
  direction: "above" | "below";
};

export default function PriceChart({
  metal,
  hours,
}: {
  metal: string;
  hours: number;
}) {
  const [data, setData] = useState<Point[]>([]);
  const [alerts, setAlerts] = useState<AlertLine[]>([]);

  useEffect(() => {
    fetch(`/api/prices/history?metal=${metal}&hours=${hours}`)
      .then((r) => r.json())
      .then((d) => setData(d.points || []));
  }, [metal, hours]);

  useEffect(() => {
    fetch(`/api/alerts/by-metal?metal=${metal}`)
      .then((r) => r.json())
      .then((d) => setAlerts(d.alerts || []));
  }, [metal]);

  return (
    <div style={{ width: "100%", height: 300 }}>
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

          {/* Price line */}
          <Line
            type="monotone"
            dataKey="price"
            strokeWidth={2}
            dot={false}
          />

          {/* Alert thresholds */}
          {alerts.map((alert) => (
            <ReferenceLine
              key={alert.id}
              y={alert.threshold}
              stroke={
                alert.direction === "above" ? "#16a34a" : "#dc2626"
              }
              strokeDasharray="4 4"
              label={{
                value: `${alert.direction} ${alert.threshold}`,
                position: "right",
                fill:
                  alert.direction === "above"
                    ? "#16a34a"
                    : "#dc2626",
                fontSize: 12,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
