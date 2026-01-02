"use client";

import PriceChart from "./PriceChart";

export default function DashboardView() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <section style={{ marginTop: 24 }}>
        <h3>Gold (last 48h)</h3>
        <PriceChart metal="Gold" />
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Silver (last 48h)</h3>
        <PriceChart metal="Silver" />
      </section>
    </main>
  );
}
