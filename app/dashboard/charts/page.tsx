"use client";

import { useState } from "react";
import PriceChart from "@/components/PriceChart";
import PriceHeader from "./PriceHeader";

type Range = "24h" | "7d" | "30d";

export default function ChartsPage() {
  const [metal, setMetal] = useState<string>("gold");
  const [range, setRange] = useState<Range>("24h");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        {/* Metal selector */}
        <div className="flex gap-2">
          {["gold", "silver", "platinum"].map((m) => (
            <button
              key={m}
              onClick={() => setMetal(m)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                metal === m
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Range selector */}
        <div className="flex gap-2">
          {(["24h", "7d", "30d"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                range === r
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* CURRENT PRICE + % CHANGE */}
      <PriceHeader metal={metal} range={range} />

      {/* CHART */}
      <PriceChart metal={metal} range={range} />
    </div>
  );
}
