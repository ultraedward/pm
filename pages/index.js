import { getMetals, getAlerts } from "../lib/dataSource";

export async function getServerSideProps() {
  const [metals, alerts] = await Promise.all([
    getMetals(),
    getAlerts(),
  ]);

  return {
    props: {
      metals,
      alerts,
      generatedAt: Date.now(),
    },
  };
}

export default function Home({ metals, alerts, generatedAt }) {
  return (
    <main>
      <header>
        <h1>Precious Metals Dashboard</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/charts">Charts</a>
          <a href="/alerts">Alerts</a>
        </nav>
      </header>

      {/* Prices */}
      <section style={{ marginBottom: 56 }}>
        <h2>Live Prices</h2>

        <div className="grid">
          {metals.map((m) => (
            <div key={m.id} className="tile">
              <div className="tile-title">{m.name}</div>
              <div className="tile-price">${m.price}</div>
              <small>Updated moments ago</small>

              <div style={{ marginTop: 12 }}>
                <a href="/charts" style={{ fontSize: 13 }}>
                  View chart →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alerts */}
      <section>
        <h2>Active Alerts</h2>

        {alerts.length === 0 ? (
          <small>No active alerts</small>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {alerts.map((a) => (
              <div key={a.id}>
                <strong>{a.metal.name}</strong>
                <div style={{ fontSize: 13, color: "#444" }}>
                  Trigger when price goes{" "}
                  <strong>{a.direction}</strong> ${a.targetPrice}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* System State */}
      <div style={{ marginTop: 64 }}>
        <small>
          Data rendered at{" "}
          {new Date(generatedAt).toLocaleTimeString()}
        </small>
      </div>
    </main>
  );
}
