"use client";

import { useEffect, useState } from "react";
import { METAL_COLORS } from "./metalColors";

type PriceData = {
  price: number | null;
  change: number | null;
};

export default function MetalLegend({
  metals,
}: {
  metals: string[];
}) {
  const [data, setData] = useState<Record<string, PriceData>>({});

  useEffect(() => {
    async function load() {
      const entries = await Promise.all(
        metals.map(async (metal) => {
          const res = await fetch(
            `/api/prices/current?metal=${metal}`
          );
          const json = await res.json();
          return [metal, json] as const;
        })
      );

      setData(Object.fromEntries(entries));
    }

    load();
  }, [metals]);

  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {metals.map((metal) => {
        const d = data[metal];
        if (!d || d.price === null) return null;

        const up = (d.change ?? 0) >= 0;

        return (
          <div
            key={metal}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: METAL_COLORS[metal],
                display: "inline-block",
              }}
            />
            <strong>{metal}</strong>
            <span>${d.price.toFixed(2)}</span>
            <span
              style={{
                color: up ? "#16a34a" : "#dc2626",
                fontWeight: 500,
              }}
            >
              {up ? "▲" : "▼"} {d.change?.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
