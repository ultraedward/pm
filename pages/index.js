// FILE: pages/index.js
import { useEffect, useState } from "react";
import { getMetals } from "../lib/dataSource";

export async function getServerSideProps() {
  const metals = await getMetals();
  return { props: { initialMetals: metals } };
}

export default function Home({ initialMetals }) {
  const [metals, setMetals] = useState(initialMetals);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const r = await fetch("/api/metals");
        const j = await r.json();
        if (alive) setMetals(j.metals || []);
      } catch {}
    };
    const id = setInterval(tick, 2500);
    tick();
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main style={{ maxWidth: 860, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Precious Metals</h1>
        <nav style={{ display: "flex", gap: 14, fontSize: 14 }}>
          <a href="/charts">Charts</a>
          <a href="/alerts">Alerts</a>
        </nav>
      </header>

      <p style={{ marginTop: 10, color: "#444" }}>
        Live-moving demo prices (Preview/Dev) — production uses real data.
      </p>

      <div style={{ display: "grid", gap: 14, marginTop: 22 }}>
        {metals.map((m) => (
          <div
            key={m.id}
            style={{
              padding: 18,
              borderRadius: 14,
              background: "#f5f5f5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 18,
            }}
          >
            <strong>{m.name}</strong>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>${m.price}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
