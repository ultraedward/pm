import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const METALS = { XAU: "Gold", XAG: "Silver", XPT: "Platinum", XPD: "Palladium" };

export default function Home() {
  const [prices, setPrices] = useState([]);
  const [history, setHistory] = useState([]);
  const [spotHistory, setSpotHistory] = useState([]);
  const [metal, setMetal] = useState("XAU");
  const [dealerPrice, setDealerPrice] = useState("");

  useEffect(() => {
    fetch("/api/prices").then(r => r.json()).then(d => setPrices(Array.isArray(d) ? d : []));
    fetch("/api/history").then(r => r.json()).then(d => setHistory(Array.isArray(d) ? d : []));
  }, []);

  useEffect(() => {
    fetch(`/api/spot-history?metal=${encodeURIComponent(metal)}&take=120`)
      .then(r => r.json())
      .then(d => setSpotHistory(Array.isArray(d) ? d : []));
  }, [metal]);

  const current = prices.find(p => p.metal === metal);
  const spot = current?.price ?? 0;

  const premium = dealerPrice && spot ? (((dealerPrice - spot) / spot) * 100) : null;

  const chartData = useMemo(() => {
    return spotHistory.map(p => ({
      t: new Date(p.at).toLocaleDateString(),
      price: Number(p.price)
    }));
  }, [spotHistory]);

  async function save() {
    await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metal, spot, dealerPrice: Number(dealerPrice) })
    });

    const r = await fetch("/api/history");
    const d = await r.json();
    setHistory(Array.isArray(d) ? d : []);
  }

  return (
    <main style={{ background:"#020617", color:"#e5e7eb", minHeight:"100vh", padding:24 }}>
      <div style={{ maxWidth:820, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
          <h1>Precious Metals</h1>
          <div style={{ display:"flex", gap:12 }}>
            <a href="/login" style={{ color:"#93c5fd" }}>Login</a>
            <a href="/account" style={{ color:"#93c5fd" }}>Account</a>
            <a href="/pricing" style={{ color:"#93c5fd" }}>Pricing</a>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:10, marginTop:12 }}>
          {prices.map(p => (
            <div key={p.metal} style={{ padding:12, border:"1px solid #334155", borderRadius:12 }}>
              <div style={{ opacity:.8 }}>{METALS[p.metal]}</div>
              <div style={{ fontSize:20, fontWeight:700 }}>${p.price.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <hr style={{ margin:"18px 0", borderColor:"#1e293b" }} />

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div style={{ padding:12, border:"1px solid #334155", borderRadius:12 }}>
            <h2 style={{ marginTop:0 }}>Premium Calculator</h2>

            <select value={metal} onChange={e => setMetal(e.target.value)} style={{ width:"100%", padding:10 }}>
              {Object.keys(METALS).map(m => (
                <option key={m} value={m}>{METALS[m]}</option>
              ))}
            </select>

            <div style={{ marginTop:10 }}>Spot: ${spot.toFixed(2)}</div>

            <input
              type="number"
              placeholder="Dealer price"
              value={dealerPrice}
              onChange={e => setDealerPrice(e.target.value)}
              style={{ width:"100%", padding:10, marginTop:10 }}
            />

            {premium !== null && isFinite(premium) && (
              <div style={{ marginTop:10, fontSize:16 }}>
                Premium: <b>{premium.toFixed(2)}%</b>
              </div>
            )}

            <button
              onClick={save}
              disabled={premium === null || !isFinite(premium)}
              style={{ marginTop:10, padding:10, width:"100%" }}
            >
              Save comparison
            </button>
          </div>

          <div style={{ padding:12, border:"1px solid #334155", borderRadius:12 }}>
            <h2 style={{ marginTop:0 }}>{METALS[metal]} Spot Chart</h2>
            <div style={{ width:"100%", height:260 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <XAxis dataKey="t" hide />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <button
              onClick={() => fetch("/api/capture").then(() => fetch(`/api/spot-history?metal=${metal}&take=120`).then(r=>r.json()).then(setSpotHistory))}
              style={{ marginTop:10, padding:10, width:"100%" }}
            >
              Capture spot snapshot
            </button>
          </div>
        </div>

        <hr style={{ margin:"18px 0", borderColor:"#1e293b" }} />

        <h2>Recent Comparisons</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:10 }}>
          {history.map(h => (
            <div key={h.id} style={{ padding:12, border:"1px solid #334155", borderRadius:12 }}>
              <div style={{ opacity:.8 }}>{METALS[h.metal]}</div>
              <div>Premium: <b>{h.premiumPct.toFixed(2)}%</b></div>
              <div style={{ opacity:.8, fontSize:12 }}>{new Date(h.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
