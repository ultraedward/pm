// app/dashboard/components/CurrentPrices.tsx
// FULL SHEET — COPY / PASTE ENTIRE FILE

"use client";

import { useEffect, useState } from "react";

type Price = {
  metal: string;
  price: number;
  createdAt: string;
  changePct: number | null;
};

export default function CurrentPrices() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prices/current")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setPrices(data.prices);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border p-4 text-sm text-gray-500">
        Loading prices…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {prices.map((p) => {
        const up = p.changePct !== null && p.changePct >= 0;

        return (
          <div
            key={p.metal}
            className="rounded-xl border p-4 bg-white shadow-sm"
          >
            <div className="text-xs uppercase text-gray-500">
              {p.metal}
            </div>

            <div className="text-2xl font-semibold">
              ${p.price.toFixed(2)}
            </div>

            {p.changePct !== null && (
              <div
                className={`text-sm mt-1 font-medium ${
                  up ? "text-green-600" : "text-red-600"
                }`}
              >
                {up ? "▲" : "▼"} {Math.abs(p.changePct).toFixed(2)}%
                <span className="text-xs text-gray-400 ml-1">
                  (24h)
                </span>
              </div>
            )}

            <div className="text-xs text-gray-400 mt-1">
              Updated {new Date(p.createdAt).toLocaleTimeString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}
