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

      <section className="grid">
        {metals.map((m) => (
          <div key={m.id} className="tile">
            <div className="tile-title">{m.name}</div>
            <div className="tile-price">${m.price}</div>
            <small>Live spot price</small>
          </div>
        ))}
      </section>
    </main>
  );
}
