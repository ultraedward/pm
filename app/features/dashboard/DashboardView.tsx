"use client";

import { useState } from "react";
import PriceChart from "./PriceChart";

export default function DashboardView() {
  const [hours, setHours] = useState(48);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      {/* Time range selector */}
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

      <section style={{ marginTop: 32 }}>
        <h3>Gold</h3>
        <PriceChart metal="Gold" hours={hours} />
      </section>

      <section style={{ marginTop: 32 }}>
        <h3>Silver</h3>
        <PriceChart metal="Silver" hours={hours} />
      </section>
    </main>
  );
}
