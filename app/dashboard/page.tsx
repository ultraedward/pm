"use client";

import { safeFetchArray } from "@/lib/safeFetch";

type PriceRow = {
  metal: string;
  price: number;
  timestamp: string;
};

type AlertRow = {
  id: string;
  metal: string;
  price: number;
  triggeredAt: string;
};

export default function DashboardPage() {
  async function load() {
    const [prices, alerts] = await Promise.all([
      safeFetchArray<PriceRow>("/api/prices"),
      safeFetchArray<AlertRow>("/api/alerts"),
    ]);

    return { prices, alerts };
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <pre className="bg-neutral-900 text-neutral-100 p-4 rounded">
        {JSON.stringify(
          {
            pricesCount: "loaded server-side",
            alertsCount: "loaded server-side",
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}