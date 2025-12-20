import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Charts() {
  const [data, setData] = useState([]);
  const [lastTick, setLastTick] = useState(Date.now());

  const refresh = async () => {
    const r = await fetch("/api/history").then((x) => x.json());
    setData(r.data || []);
    setLastTick(Date.now());
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="row" style={{ marginBottom: 18 }}>
        <div>
          <div className="h1">Charts</div>
          <div className="subhead">Fast refresh. Always visible. Built for testers.</div>
        </div>
        <div className="small mono">
          last refresh: <strong>{Math.round((Date.now() - lastTick) / 1000)}s</strong> ago
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="h2">Price History</div>
          <div className="panel-actions">
            <a className="btn" href="/">
              Back to Dashboard
            </a>
            <button className="btn btn-primary" onClick={refresh}>
              Refresh Now
            </button>
          </div>
        </div>

        <div style={{ height: 420, background: "#fff", borderRadius: 14, border: "1px solid #eaeaea", padding: 12 }}>
          <ResponsiveContainer>
            <LineChart data={data}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: 12 }} className="small">
          Tip: in demo mode prices move smoothly; in prod you’ll wire real feeds.
        </div>
      </div>
    </>
  );
}
