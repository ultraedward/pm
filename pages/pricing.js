export default function Pricing() {
  async function buy() {
    const r = await fetch("/api/billing/checkout", { method: "POST" });
    const d = await r.json();
    if (d?.url) window.location.href = d.url;
  }

  return (
    <main style={{ background:"#020617", color:"#e5e7eb", minHeight:"100vh", padding:24 }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        <h1>Premium Alerts</h1>

        <p style={{ marginTop:12, opacity:0.9 }}>
          Stop checking prices all day.
        </p>

        <p style={{ marginTop:8, opacity:0.9 }}>
          Set a target premium and get notified when a metal is actually a good deal.
        </p>

        <div style={{
          marginTop:20,
          padding:16,
          border:"1px solid #334155",
          borderRadius:12
        }}>
          <h2>$29 — Lifetime Access</h2>

          <ul style={{ marginTop:12, lineHeight:1.6 }}>
            <li>✔ Premium alerts for Gold, Silver, Platinum, Palladium</li>
            <li>✔ Unlimited saved comparisons</li>
            <li>✔ Email alerts when your target is hit</li>
            <li>✔ One-time payment (no subscription)</li>
          </ul>

          <button
            onClick={buy}
            style={{
              marginTop:16,
              padding:12,
              width:"100%",
              fontSize:16,
              background:"#2563eb",
              color:"#fff",
              borderRadius:8
            }}
          >
            Unlock Premium Alerts
          </button>

          <p style={{ marginTop:10, fontSize:12, opacity:0.7 }}>
            Early access pricing. May increase later.
          </p>
        </div>
      </div>
    </main>
  );
}
