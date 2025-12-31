"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
    async function load() {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setPrices(data.prices || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading dashboard…</div>;
  }

  const chartData = prices.map((p) => ({
    name: p.metal,
    price: p.price,
  }));

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <section style={{ marginTop: 24, width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#000"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      <table
        style={{
          marginTop: 32,
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
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
