"use client";

import { useState } from "react";
import PriceHeader from "@/components/PriceHeader";
import PriceChart from "@/components/PriceChart";

export default function ChartsPage() {
  const [metal, setMetal] = useState("gold");
  const [range, setRange] = useState<"24h" | "7d" | "30d">("24h");

  return (
    <div>
      <PriceHeader metal={metal} range={range} />

      <div className="mb-4 flex gap-2">
        {["gold", "silver", "platinum"].map(m => (
          <button
            key={m}
            onClick={() => setMetal(m)}
            className={`px-3 py-1 rounded ${
              metal === m ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        {(["24h", "7d", "30d"] as const).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded ${
              range === r ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <PriceChart metal={metal} range={range} />
    </div>
  );
}
