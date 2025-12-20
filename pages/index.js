import { getMetals } from "../lib/dataSource";

export async function getServerSideProps() {
  const metals = await getMetals();
  return { props: { metals } };
}

export default function Home({ metals }) {
  return (
    <main>
      <header>
        <h1>Precious Metals</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/charts">Charts</a>
          <a href="/alerts">Alerts</a>
        </nav>
      </header>

      <p style={{ maxWidth: 520, marginBottom: 48 }}>
        Track precious metals in real time. Visualize trends. Set alerts when
        prices move.
      </p>

      <section className="grid">
        {metals.map((m) => (
          <div key={m.id} className="tile">
            <div className="tile-title">{m.name}</div>
            <div className="tile-price">${m.price}</div>

            <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
              <a href="/charts" style={{ fontSize: 13 }}>
                View chart →
              </a>
              <a href="/alerts" style={{ fontSize: 13 }}>
                Set alert →
              </a>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
