"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

type Range = "24h" | "7d" | "30d";

type Props = {
  metal: string;
  range: Range;
};

type Row = {
  t: number;
  price: number;
};

export default function PriceChart({ metal, range }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [normalized, setNormalized] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(
        `/api/charts/prices?metal=${metal}&range=${range}`
      );
      const data = await res.json();
      setRows(data);
    }
    load();
  }, [metal, range]);

  if (!rows.length) return null;

  const base = rows[0].price;

  const chartData = rows.map((r) => ({
    t: new Date(r.t).toLocaleTimeString(),
    value: normalized ? ((r.price - base) / base) * 100 : r.price,
  }));

  return (
    <div>
      <div className="flex items-center justify-end mb-2">
        <button
          onClick={() => setNormalized(!normalized)}
          className="text-xs px-2 py-1 border rounded hover:bg-gray-100"
        >
          {normalized ? "Show Price" : "Show % Change"}
        </button>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="t" tick={{ fontSize: 10 }} />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) =>
                normalized ? `${v.toFixed(1)}%` : `$${v}`
              }
            />
            <Tooltip
              formatter={(v: number) =>
                normalized ? `${v.toFixed(2)}%` : `$${v.toFixed(2)}`
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
