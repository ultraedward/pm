"use client";

import { useState } from "react";
import MultiMetalChart from "./MultiMetalChart";
import MetalLegend from "./MetalLegend";
import ExportButtons from "./ExportButtons";

const METALS = ["Gold", "Silver", "Platinum", "Palladium"] as const;
type Metal = (typeof METALS)[number];

export default function DashboardView() {
  const [hours, setHours] = useState(48);
  const [normalized, setNormalized] = useState(false);
  const [enabled, setEnabled] = useState<Record<Metal, boolean>>({
    Gold: true,
    Silver: true,
    Platinum: false,
    Palladium: false,
  });

  function toggle(metal: Metal) {
    setEnabled((prev) => ({
      ...prev,
      [metal]: !prev[metal],
    }));
  }

  const activeMetals = METALS.filter((m) => enabled[m]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {/* Controls */}
      <section style={{ marginTop: 16 }}>
        <label style={{ marginRight: 8 }}>Time range:</label>
        <select
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        >
          <option value={24}>Last 24 hours</option>
          <option value={168}>Last 7 days</option>
          <option value={720}>Last 30 days</option>
        </select>

        <label style={{ marginLeft: 16 }}>
          <input
            type="checkbox"
            checked={normalized}
            onChange={() => setNormalized((v) => !v)}
          />{" "}
          Normalize (%)
        </label>
      </section>

      {/* Metal toggles */}
      <section style={{ marginTop: 16 }}>
        {METALS.map((metal) => (
          <label key={metal} style={{ marginRight: 12 }}>
            <input
              type="checkbox"
              checked={enabled[metal]}
              onChange={() => toggle(metal)}
            />{" "}
            {metal}
          </label>
        ))}
      </section>

      {/* Legend */}
      <section style={{ marginTop: 24 }}>
        <MetalLegend metals={activeMetals} />
      </section>

      {/* Export */}
      <section style={{ marginTop: 16 }}>
        <ExportButtons hours={hours} />
      </section>

      {/* Chart */}
      <section style={{ marginTop: 24 }}>
        <MultiMetalChart
          hours={hours}
          enabled={enabled}
          normalized={normalized}
        />
      </section>
    </main>
  );
}
