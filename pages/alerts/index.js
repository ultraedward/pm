// FILE: pages/alerts/index.js
import { useEffect, useState } from "react";
import { getAlerts } from "../../lib/dataSource";

export async function getServerSideProps() {
  const alerts = await getAlerts();
  return { props: { initialAlerts: alerts } };
}

export default function Alerts({ initialAlerts }) {
  const [alerts, setAlerts] = useState(initialAlerts);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const r = await fetch("/api/alerts");
        const j = await r.json();
        if (alive) setAlerts(j.alerts || []);
      } catch {}
    };
    const id = setInterval(tick, 4000);
    tick();
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main style={{ maxWidth: 860, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Alerts</h1>
        <nav style={{ display: "flex", gap: 14, fontSize: 14 }}>
          <a href="/">Home</a>
          <a href="/charts">Charts</a>
        </nav>
      </header>

      <div style={{ marginTop: 22, display: "grid", gap: 14 }}>
        {alerts.map((a) => (
          <div
            key={a.id}
            style={{
              padding: 18,
              borderRadius: 14,
              background: "#f5f5f5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{a.metal?.name}</div>
              <div style={{ fontSize: 13, color: "#444" }}>
                Trigger when <strong>{a.direction}</strong> ${a.targetPrice}
              </div>
            </div>
            <span style={{ fontSize: 12, color: "#666" }}>{String(a.id).slice(0, 8)}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
