import { getMetals } from "../lib/dataSource";

export async function getServerSideProps() {
  const metals = await getMetals();
  return { props: { metals } };
}

export default function Home({ metals }) {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 32, marginBottom: 24 }}>Precious Metals</h1>

      <div style={{ display: "grid", gap: 16 }}>
        {metals.map((m) => (
          <div
            key={m.id}
            style={{
              padding: 20,
              borderRadius: 12,
              background: "#f5f5f5",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
            }}
          >
            <strong>{m.name}</strong>
            <span>${m.price}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
