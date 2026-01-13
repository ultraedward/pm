"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useEffect, useState } from "react";

type Props = {
  metal: string;
  range: "24h" | "7d" | "30d";
};

export default function PriceChart({ metal, range }: Props) {
  const [prices, setPrices] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/charts/prices?metal=${metal}&range=${range}`)
      .then((res) => res.json())
      .then(setPrices);

    fetch(`/api/charts/alerts?metal=${metal}`)
      .then((res) => res.json())
      .then(setAlerts);
  }, [metal, range]);

  return (
    <div className="w-full h-[400px] border rounded p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={prices}>
          <XAxis
            dataKey="t"
            tickFormatter={(v) => new Date(v).toLocaleTimeString()}
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip
            labelFormatter={(v) =>
              new Date(v).toLocaleString()
            }
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#000"
            dot={false}
          />

          {alerts.map((alert) => (
            <ReferenceLine
              key={alert.id}
              y={alert.price}
              stroke={alert.direction === "above" ? "red" : "green"}
              strokeDasharray="4 4"
              label={{
                value: `${alert.direction === "above" ? "↑" : "↓"} ${alert.price}`,
                position: "right",
                fill: alert.direction === "above" ? "red" : "green",
                fontSize: 12,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
