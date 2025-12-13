export default function Pricing() {
  async function buy() {
    const r = await fetch("/api/billing/checkout", { method: "POST" });
    const d = await r.json();
    if (d?.url) window.location.href = d.url;
  }

  return (
    <main style={{ background:"#020617", color:"#e5e7eb", minHeight:"100vh", padding:24 }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        <h1>Pricing</h1>
        <div style={{ marginTop:16, padding:16, border:"1px solid #334155", borderRadius:10 }}>
          <h2>Premium Alerts</h2>
          <p>One-time purchase.</p>
          <button onClick={buy} style={{ marginTop:12, padding:10, width:"100%" }}>
            Buy $29
          </button>
        </div>
      </div>
    </main>
  );
}
