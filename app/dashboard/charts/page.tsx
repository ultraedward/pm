"use client";

import { useState } from "react";
import PriceHeader from "./PriceHeader";
import PriceChart from "./PriceChart";
import MetalSelector from "./MetalSelector";

type Range = "24h" | "7d" | "30d";

export default function ChartsPage() {
  const [metal, setMetal] = useState("gold");
  const [range, setRange] = useState<Range>("24h");

  return (
    <div className="p-6">
      <MetalSelector metal={metal} onChange={setMetal} />

      <div className="flex gap-2 mb-4">
        {(["24h", "7d", "30d"] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded text-sm border ${
              range === r
                ? "bg-black text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <PriceHeader metal={metal} range={range} />
      <PriceChart metal={metal} range={range} />
    </div>
  );
}
