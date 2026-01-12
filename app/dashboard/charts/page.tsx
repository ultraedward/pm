"use client";

import { useEffect, useState } from "react";
import PriceChart from "@/components/PriceChart";

export default function ChartsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/charts/prices")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading charts...</p>;

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-bold">Price Charts (24h)</h1>

      <div>
        <h2 className="font-semibold mb-2">Gold</h2>
        <PriceChart data={data.gold} color="#facc15" />
      </div>

      <div>
        <h2 className="font-semibold mb-2">Silver</h2>
        <PriceChart data={data.silver} color="#d1d5db" />
      </div>

      <div>
        <h2 className="font-semibold mb-2">Platinum</h2>
        <PriceChart data={data.platinum} color="#60a5fa" />
      </div>
    </div>
  );
}
