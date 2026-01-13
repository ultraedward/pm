"use client";

import { useEffect, useState } from "react";

type Range = "24h" | "7d" | "30d";

type Props = {
  metal: string;
  range: Range;
};

export default function PriceHeader({ metal, range }: Props) {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/charts/prices?range=${range}`);
      const data: { price: number }[] = await res.json();

      if (!Array.isArray(data) || data.length < 2) return;

      const first = data[0].price;
      const last = data[data.length - 1].price;

      setPrice(last);
      setChange(((last - first) / first) * 100);
    }

    load();
  }, [metal, range]);

  if (price === null || change === null) return null;

  const positive = change >= 0;

  return (
    <div className="mb-6">
      <div className="text-sm uppercase tracking-wide text-gray-500">
        {metal}
      </div>

      <div className="flex items-baseline gap-3">
        <div className="text-3xl font-bold">
          ${price.toFixed(2)}
        </div>

        <div
          className={`text-sm font-semibold ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {positive ? "+" : ""}
          {change.toFixed(2)}% ({range})
        </div>
      </div>
    </div>
  );
}
