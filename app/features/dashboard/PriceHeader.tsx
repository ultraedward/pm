"use client";

import { useEffect, useState } from "react";

type PriceData = {
  price: number | null;
  change: number | null;
};

export default function PriceHeader({ metal }: { metal: string }) {
  const [data, setData] = useState<PriceData | null>(null);

  useEffect(() => {
    fetch(`/api/prices/current?metal=${metal}`)
      .then((r) => r.json())
      .then(setData);
  }, [metal]);

  if (!data || data.price === null) {
    return <p>Loading...</p>;
  }

  const isUp = (data.change ?? 0) >= 0;

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 24, fontWeight: "bold" }}>
        ${data.price.toFixed(2)}
      </div>
      <div
        style={{
          color: isUp ? "#16a34a" : "#dc2626",
          fontWeight: 500,
        }}
      >
        {isUp ? "▲" : "▼"} {data.change?.toFixed(2)}%
      </div>
    </div>
  );
}
