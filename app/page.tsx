export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 900, margin: "80px auto", padding: 24 }}>
      <h1 style={{ fontSize: 32, marginBottom: 12 }}>
        Precious Metals Tracker
      </h1>
      <p style={{ fontSize: 16, color: "#555" }}>
        Track prices, set alerts, and monitor trends across gold, silver,
        platinum, and palladium.
      </p>
    </main>
  );
}
