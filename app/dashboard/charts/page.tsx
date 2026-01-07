"use client";

import { useEffect, useState } from "react";

type PricePoint = {
  id: string;
  metal: string;
  price: number;
  createdAt: string;
};

export default function ChartsPage() {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/charts/prices")
      .then((res) => res.json())
      .then((json) => {
        setData(json.prices || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-6">Loading chart…</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Spot Price History</h1>

      <div className="border rounded p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Metal</th>
              <th className="py-2">Price</th>
              <th className="py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2 capitalize">{p.metal}</td>
                <td className="py-2">${p.price.toFixed(2)}</td>
                <td className="py-2">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
