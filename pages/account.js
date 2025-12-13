import { useEffect, useState } from "react";

const METALS = { XAU: "Gold", XAG: "Silver", XPT: "Platinum", XPD: "Palladium" };

export default function Account() {
  const [alerts, setAlerts] = useState([]);
  const [metal, setMetal] = useState("XAU");
  const [threshold, setThreshold] = useState("5");

  async function load() {
    const r = await fetch("/api/alerts");
    if (r.status !== 200) return;
    const d = await r.json();
    setAlerts(Array.isArray(d) ? d : []);
  }

  useEffect(() => { load(); }, []);

  async function add() {
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metal, threshold: Number(threshold) })
    });
    await load();
  }

  async function toggle(id, isActive) {
    await fetch("/api/alerts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive })
    });
    await load();
  }

  return (
    <main style={{ background:"#020617", color:"#e5e7eb", minHeight:"100vh", padding:24 }}>
      <div style={{ maxWidth:520, margin:"0 auto" }}>
        <h1>Account</h1>
        <a href="/api/auth/logout" style={{ color:"#93c5fd" }}>Logout</a>

        <hr style={{ margin:"16px 0" }} />

        <h2>Alerts</h2>

        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <select value={metal} onChange={e=>setMetal(e.target.value)} style={{ flex:1, padding:10 }}>
            {Object.keys(METALS).map(m => <option key={m} value={m}>{METALS[m]}</option>)}
          </select>
          <input
            value={threshold}
            onChange={e=>setThreshold(e.target.value)}
            placeholder="Threshold %"
            style={{ width:140, padding:10 }}
          />
        </div>

        <button onClick={add} style={{ marginTop:10, padding:10, width:"100%" }}>
          Add alert (premium % ≤ threshold)
        </button>

        <div style={{ marginTop:16 }}>
          {alerts.map(a => (
            <div key={a.id} style={{ padding:10, border:"1px solid #334155", borderRadius:10, marginBottom:8 }}>
              <div>{METALS[a.metal]} ≤ {a.threshold.toFixed(2)}%</div>
              <button onClick={() => toggle(a.id, !a.isActive)} style={{ marginTop:8, padding:8, width:"100%" }}>
                {a.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
        </div>

        <hr style={{ margin:"16px 0" }} />
        <a href="/pricing" style={{ color:"#93c5fd" }}>Pricing</a>
      </div>
    </main>
  );
}
