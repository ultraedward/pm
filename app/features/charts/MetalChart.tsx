"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type RawPoint = {
  timestamp?: string;
  t?: number;
  price?: number;
};

type Props = {
  data: unknown;
  metal: string;
};

export default function MetalChart({ data, metal }: Props) {
  const safeData = Array.isArray(data)
    ? data.filter(
        (d: any) =>
          d &&
          typeof d === "object" &&
          typeof d.price === "number" &&
          (typeof d.timestamp === "string" || typeof d.t === "number")
      )
    : [];

  if (safeData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const normalized = safeData.map((d: any) => ({
    t: d.t ?? new Date(d.timestamp).getTime(),
    price: d.price,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalized}>
          <XAxis
            dataKey="t"
            type="number"
            domain={["auto", "auto"]}
            hide
          />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
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
