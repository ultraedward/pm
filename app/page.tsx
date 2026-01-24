"use client";

import { useEffect, useState } from "react";
import { ensureArray } from "@/lib/ensureArray";

export default function DashboardPage() {
  const [prices, setPrices] = useState<any>(null);
  const [alerts, setAlerts] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/prices").then(r => r.json()).catch(() => null),
      fetch("/api/alerts").then(r => r.json()).catch(() => null),
    ]).then(([p, a]) => {
      setPrices(p);
      setAlerts(a);
    });
  }, []);

  const safePrices = ensureArray(prices?.prices ?? prices);
  const safeAlerts = ensureArray(alerts?.alerts ?? alerts);

  return (
    <div>
      <h2>Prices</h2>
      {safePrices.slice(0, 10).map((p, i) => (
        <div key={i}>{JSON.stringify(p)}</div>
      ))}

      <h2>Alerts</h2>
      {safeAlerts.map((a, i) => (
        <div key={i}>{JSON.stringify(a)}</div>
      ))}
    </div>
  );
}