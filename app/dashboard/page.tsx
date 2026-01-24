"use client";

import { useEffect, useState } from "react";

type PriceRow = {
  metal: string;
  price: number;
  timestamp: string;
};

export default function DashboardPage() {
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/prices");
        const json = await res.json();

        // 🔒 ABSOLUTE GUARD
        setPrices(Array.isArray(json.prices) ? json.prices : []);
      } catch {
        setPrices([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div>
      <h1>Prices</h1>

      {prices.slice(0, 10).map((p, i) => (
        <div key={i}>
          {p.metal}: ${p.price}
        </div>
      ))}
    </div>
  );
}