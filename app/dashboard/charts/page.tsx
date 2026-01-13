"use client";

import { useEffect, useState } from "react";
import PriceChart from "./PriceChart";
import PriceHeader from "./PriceHeader";

type Range = "24h" | "7d" | "30d";

type Point = {
  t: number;
  price: number;
};

export default function ChartsPage() {
  const [metal, setMetal] = useState("gold");
  const [range, setRange] = useState<Range>("24h");
  const [prices, setPrices] = useState<Point[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    fetch(`/api/charts/prices?metal=${metal}&range=${range}`)
      .then((r) => r.json())
      .then((data) => {
        setPrices(data);
      })
      .finally(() => setLoading(false));
  }, [metal, range]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["gold", "silver", "platinum", "palladium"].map((m) => (
          <button
            key={m}
            onClick={() => setMetal(m)}
            className={m === metal ? "font-bold" : ""}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {(["24h", "7d", "30d"] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={r === range ? "font-bold" : ""}
          >
            {r}
          </button>
        ))}
      </div>

      <PriceHeader metal={metal} range={range} />

      {loading ? (
        <div style={{ height: 360 }} className="flex items-center justify-center">
          Loading…
        </div>
      ) : (
        <PriceChart data={prices} />
      )}
    </div>
  );
}
