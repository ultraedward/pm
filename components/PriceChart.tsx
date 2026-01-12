"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: any[];
};

export default function PriceChart({ data }: Props) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="t"
            tickFormatter={(v) =>
              new Date(v).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(v) => new Date(v).toLocaleString()}
          />
          <Line type="monotone" dataKey="gold" stroke="#FFD700" dot={false} />
          <Line type="monotone" dataKey="silver" stroke="#C0C0C0" dot={false} />
          <Line type="monotone" dataKey="platinum" stroke="#8FAADC" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
