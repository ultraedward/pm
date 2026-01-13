"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from "recharts";

type Point = {
  t: number;
  price: number;
};

type Props = {
  data: Point[];
  alerts?: Point[];
};

export default function PriceChart({ data, alerts = [] }: Props) {
  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="t"
            tickFormatter={(t) =>
              new Date(t).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip labelFormatter={(t) => new Date(t).toLocaleString()} />

          <Line
            type="monotone"
            dataKey="price"
            strokeWidth={2}
            dot={false}
          />

          <Scatter data={alerts} fill="#ff4d4f" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
