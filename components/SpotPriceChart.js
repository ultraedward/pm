"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SpotPriceChart({ data, metal }) {
  const filtered = data.filter((d) => d.metal === metal);

  return (
    <div style={{ width: "100%", height: 420, minHeight: 320 }}>
      <ResponsiveContainer>
        <LineChart data={filtered}>
          <XAxis dataKey="time" hide />
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
