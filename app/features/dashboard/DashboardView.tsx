"use client";

import { useState } from "react";
import PriceHeader from "./PriceHeader";
import MultiMetalChart from "./MultiMetalChart";

const METALS = ["Gold", "Silver", "Platinum", "Palladium"] as const;

type Metal = (typeof METALS)[number];

export default function DashboardView() {
  const [hours, setHours] = useState(48);
  const [enabled, setEnabled] = useState<Record<Metal, boolean>>({
    Gold: true,
    Silver: true,
    Platinum: false,
    Palladium: false,
  });

  function toggle(metal: Metal) {
    setEnabled((e) => ({ ...e, [metal]: !e[metal] }));
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {/* Time range */}
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

      {/* Current prices */}
      <section style={{ marginTop: 24 }}>
        {METALS.filter((m) => enabled[m]).map((metal) => (
          <div key={metal} style={{ marginBottom: 8 }}>
            <strong>{metal}</strong>
            <PriceHeader metal={metal} />
          </div>
        ))}
      </section>

      {/* Chart */}
      <section style={{ marginTop: 24 }}>
        <MultiMetalChart hours={hours} enabled={enabled} />
      </section>
    </main>
  );
}
