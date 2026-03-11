"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

type Point = {
  price: number;
  timestamp: string;
};

export default function MetalsChart() {
  const [gold, setGold] = useState<Point[]>([]);
  const [silver, setSilver] = useState<Point[]>([]);
  const [range, setRange] = useState("24h");

  async function loadData(r: string) {
    const res = await fetch(`/api/prices/history?range=${r}`);
    const data = await res.json();

    setGold(data.gold || []);
    setSilver(data.silver || []);
  }

  useEffect(() => {
    loadData(range);
  }, [range]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      
      <div style={{ marginBottom: 20 }}>
        {["24h", "7d", "30d", "1y"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              marginRight: 10,
              padding: "6px 12px",
              background: range === r ? "#333" : "#eee",
              color: range === r ? "white" : "black"
            }}
          >
            {r.toUpperCase()}
          </button>
        ))}
      </div>

      <ResponsiveContainer>
        <LineChart data={gold}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(t) => new Date(t).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(t) =>
              new Date(t).toLocaleString()
            }
          />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#facc15"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}