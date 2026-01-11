// app/dashboard/components/CurrentPrices.tsx
// FULL SHEET — COPY / PASTE ENTIRE FILE
// Auto-refreshes prices every 60 seconds

"use client";

import { useEffect, useState } from "react";

type Price = {
  metal: string;
  price: number;
  createdAt: string;
  changePct: number | null;
};

const REFRESH_MS = 60_000; // 60 seconds

export default function CurrentPrices() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    const res = await fetch("/api/prices/current", {
      cache: "no-store",
    });
    const data = await res.json();

    if (data.ok) {
      setPrices(data.prices);
      setLastUpdated(new Date());
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border p-4 text-sm text-gray-500">
        Loading prices…
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs text-gray-400">
        Auto-refreshes every 60s
        {lastUpdated && (
          <> · Last update {lastUpdated.toLocaleTimeString()}</>
        )}
      </div>

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
                  {up ? "▲" : "▼"}{" "}
                  {Math.abs(p.changePct).toFixed(2)}%
                  <span className="text-xs text-gray-400 ml-1">
                    (24h)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
