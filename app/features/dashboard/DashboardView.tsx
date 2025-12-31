"use client";

import { useEffect, useState } from "react";

type Price = {
  metal: string;
  price: number;
  change: number;
  updatedAt: string;
};

export default function DashboardView() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setPrices(data.prices || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading dashboard…</div>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <table style={{ marginTop: 16, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Metal</th>
            <th align="right">Price</th>
            <th align="right">Change</th>
            <th align="right">Updated</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p) => (
            <tr key={p.metal}>
              <td>{p.metal}</td>
              <td align="right">${p.price.toFixed(2)}</td>
              <td
                align="right"
                style={{ color: p.change >= 0 ? "green" : "red" }}
              >
                {p.change >= 0 ? "+" : ""}
                {p.change.toFixed(2)}%
              </td>
              <td align="right">
                {new Date(p.updatedAt).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
