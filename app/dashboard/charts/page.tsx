"use client";

import { useEffect, useState } from "react";
import PriceChart from "@/components/PriceChart";

type RangeKey = "24h" | "7d" | "30d";

export default function ChartsPage() {
  const [range, setRange] = useState<RangeKey>("24h");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/charts/prices?range=${range}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, [range]);

  return (
    <div style={{ padding: 24 }}>
      <h1>Charts</h1>

      <div style={{ marginBottom: 16 }}>
        {(["24h", "7d", "30d"] as RangeKey[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              marginRight: 8,
              padding: "6px 12px",
              background: range === r ? "#444" : "#222",
              color: "white",
              border: "1px solid #555",
              cursor: "pointer",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {loading ? <p>Loading chart…</p> : <PriceChart data={data} />}
    </div>
  );
}
