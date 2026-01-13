"use client";

import { useEffect, useState } from "react";

export default function PriceHeader({
  metal,
  range,
}: {
  metal: string;
  range: "24h" | "7d" | "30d";
}) {
  const [data, setData] = useState<{ latest: number; pct: number } | null>(null);

  useEffect(() => {
    fetch(`/api/charts/summary?metal=${metal}&range=${range}`)
      .then(r => r.json())
      .then(setData);
  }, [metal, range]);

  if (!data) return null;

  const up = data.pct >= 0;

  return (
    <div className="mb-4 flex items-baseline gap-3">
      <h1 className="text-3xl font-semibold capitalize">
        {metal} ${data.latest.toFixed(2)}
      </h1>
      <span
        className={`text-lg font-medium ${
          up ? "text-green-600" : "text-red-600"
        }`}
      >
        {up ? "+" : ""}
        {data.pct.toFixed(2)}%
      </span>
    </div>
  );
}
