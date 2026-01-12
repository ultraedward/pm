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
  data: { t: number; price: number }[];
  color: string;
};

export default function PriceChart({ data, color }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="t"
          tickFormatter={(v) => new Date(v).getHours().toString()}
        />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip
          labelFormatter={(v) =>
            new Date(Number(v)).toLocaleString()
          }
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
