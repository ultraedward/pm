import { getAlerts } from "../../lib/dataSource";

export async function getServerSideProps() {
  const alerts = await getAlerts();
  return { props: { alerts } };
}

export default function Alerts({ alerts }) {
  return (
    <main>
      <header>
        <h1>Alerts</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/charts">Charts</a>
        </nav>
      </header>

      <div style={{ display: "grid", gap: 32 }}>
        {alerts.map((a) => (
          <div key={a.id}>
            <div style={{ fontWeight: 700 }}>{a.metal.name}</div>
            <small>
              Trigger when price goes{" "}
              <strong>{a.direction}</strong> ${a.targetPrice}
            </small>
          </div>
        ))}
      </div>
    </main>
  );
}
