// app/dashboard/charts/view.tsx
// FULL SHEET
// Client-only chart logic

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PriceRow = {
  price: number;
  createdAt: string;
};

export default function MetalChartClient() {
  const params = useSearchParams();
  const metal = params.get("metal") || "gold";

  const [data, setData] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/export/prices", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) {
          setData(
            json.prices.filter(
              (p: any) => p.metal === metal
            )
          );
        }
      })
      .finally(() => setLoading(false));
  }, [metal]);

  if (loading) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold capitalize">
        {metal} Price Chart
      </h1>

      <div className="border rounded-xl p-4">
        <svg
          viewBox="0 0 100 100"
          className="h-64 w-full"
          preserveAspectRatio="none"
        >
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="2"
            points={toPoints(data)}
          />
        </svg>
      </div>
    </div>
  );
}

function toPoints(data: PriceRow[]) {
  if (data.length < 2) return "";

  const values = data.map((d) => d.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.price - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
}
