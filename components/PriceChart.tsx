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

export type Range = "24h" | "7d" | "30d";

type PricePoint = {
  t: number;
  price: number;
};

type AlertLine = {
  price: number;
  direction: "above" | "below";
};

type ApiResponse = {
  prices: PricePoint[];
  alerts: AlertLine[];
};

type Props = {
  metal: string;
  range: Range;
};

export default function PriceChart({ metal, range }: Props) {
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [alerts, setAlerts] = useState<AlertLine[]>([]);

  useEffect(() => {
    fetch(`/api/charts/prices?metal=${metal}&range=${range}`)
      .then(r => r.json())
      .then((res: ApiResponse) => {
        setPrices(Array.isArray(res.prices) ? res.prices : []);
        setAlerts(Array.isArray(res.alerts) ? res.alerts : []);
      });
  }, [metal, range]);

  if (!prices.length) {
    return (
      <div className="h-[320px] flex items-center justify-center text-gray-400">
        No data
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={prices}>
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

          {alerts.map((a, i) => (
            <ReferenceLine
              key={i}
              y={a.price}
              stroke={a.direction === "above" ? "green" : "red"}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
            />
          ))}

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
