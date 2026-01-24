"use client";

import { useEffect, useState } from "react";
import { safeFetchArray } from "@/lib/safeFetch";

type PriceRow = {
  metal: string;
  price: number;
  timestamp: string;
};

type AlertRow = {
  id: string;
  metal: string;
  targetPrice: number;
};

export default function DashboardPage() {
  const [prices, setPrices] = useState<PriceRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [p, a] = await Promise.all([
        safeFetchArray<PriceRow>("/api/prices", "prices"),
        safeFetchArray<AlertRow>("/api/alerts", "alerts"),
      ]);

      setPrices(p);
      setAlerts(a);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-bold">Prices</h2>
        {prices.slice(0, 10).map((p, i) => (
          <div key={i}>
            {p.metal}: ${p.price}
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold">Alerts</h2>
        {alerts.length === 0 && <div>No alerts</div>}
        {alerts.map(a => (
          <div key={a.id}>
            {a.metal} → ${a.targetPrice}
          </div>
        ))}
      </section>
    </div>
  );
}