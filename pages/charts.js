// FILE: pages/charts.js
import { useEffect, useState } from "react";
import { getPriceHistory } from "../lib/dataSource";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export async function getServerSideProps() {
  const data = await getPriceHistory();
  return { props: { initialData: data } };
}

export default function Charts({ initialData }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    let alive = true;
    const tick = async () => {
      try {
        const r = await fetch("/api/history");
        const j = await r.json();
        if (alive) setData(j.data || []);
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
    <main style={{ maxWidth: 980, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 34, margin: 0 }}>Charts</h1>
        <nav style={{ display: "flex", gap: 14, fontSize: 14 }}>
          <a href="/">Home</a>
          <a href="/alerts">Alerts</a>
        </nav>
      </header>

      <div style={{ marginTop: 22, height: 360, background: "#f5f5f5", borderRadius: 14, padding: 12 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" hide />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
