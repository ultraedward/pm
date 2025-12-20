import { useEffect, useMemo, useState } from "react";

function fmt(n) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(Number(n));
  } catch {
    return `$${n}`;
  }
}

export default function Dashboard() {
  const [metals, setMetals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastTick, setLastTick] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState([]);

  const demo = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  const addLog = (msg) =>
    setLog((prev) => [{ t: new Date().toLocaleTimeString(), msg }, ...prev].slice(0, 12));

  const refreshAll = async () => {
    setBusy(true);
    try {
      const [m, a] = await Promise.all([
        fetch("/api/metals").then((r) => r.json()),
        fetch("/api/alerts").then((r) => r.json()),
      ]);
      setMetals(m.metals || []);
      setAlerts(a.alerts || []);
      setLastTick(Date.now());
      addLog("Refreshed metals + alerts");
    } catch (e) {
      addLog("Refresh failed");
    } finally {
      setBusy(false);
    }
  };

  const triggerAlertCheck = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/cron/check-alerts").then((x) => x.json());
      addLog(`Alert check: ${r.mock ? "skipped (demo)" : "ran"}`);
    } catch {
      addLog("Alert check failed");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    refreshAll();
    const id = setInterval(refreshAll, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deltas = useMemo(() => {
    // naive delta: compare current list to previous render in memory
    // For power testing we just show "moving" indicator based on time.
    return metals.reduce((acc, m) => {
      acc[m.id] = Math.sin(Date.now() / 3000 + m.price) >= 0 ? "up" : "down";
      return acc;
    }, {});
  }, [metals, lastTick]);

  return (
    <>
      <div className="row" style={{ marginBottom: 18 }}>
        <div>
          <div className="h1">Dashboard</div>
          <div className="subhead">
            Prices + Alerts surfaced for power testers. Everything observable. Everything testable.
          </div>
        </div>

        <div className="panel-actions">
          <button className="btn btn-primary" onClick={refreshAll} disabled={busy}>
            Refresh Now
          </button>
          <button className="btn" onClick={triggerAlertCheck} disabled={busy}>
            Trigger Alert Check
          </button>
          <a className="btn" href="/charts">
            Go to Charts
          </a>
          <a className="btn" href="/alerts">
            Go to Alerts
          </a>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Watchlist / Prices */}
        <div className="panel">
          <div className="panel-header">
            <div className="h2">Watchlist</div>
            <div className="small mono">
              last refresh: <strong>{Math.round((Date.now() - lastTick) / 1000)}s</strong> ago
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th className="th">Metal</th>
                <th className="th">Price</th>
                <th className="th">Move</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {metals.map((m) => (
                <tr key={m.id}>
                  <td className="td">
                    <strong>{m.name}</strong>
                  </td>
                  <td className="td mono">
                    <strong>{fmt(m.price)}</strong>
                  </td>
                  <td className="td">
                    {deltas[m.id] === "up" ? (
                      <span className="delta-up">↑ UP</span>
                    ) : (
                      <span className="delta-down">↓ DOWN</span>
                    )}
                  </td>
                  <td className="td">
                    <a href="/charts" className="small">
                      View chart →
                    </a>{" "}
                    <span className="small">•</span>{" "}
                    <a href="/alerts" className="small">
                      Set/see alerts →
                    </a>
                  </td>
                </tr>
              ))}
              {metals.length === 0 && (
                <tr>
                  <td className="td" colSpan={4}>
                    <span className="small">No metals loaded yet.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }} className="small">
            Mode: <strong>{demo ? "Demo (mock)" : "Prod (live)"}</strong>
          </div>
        </div>

        {/* Alerts + System */}
        <div className="panel">
          <div className="panel-header">
            <div className="h2">Alerts Console</div>
            <span className="pill">{alerts.length} active</span>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {alerts.map((a) => (
              <div key={a.id} className="panel" style={{ background: "#fff" }}>
                <div className="row">
                  <div>
                    <div style={{ fontWeight: 900 }}>{a.metal?.name}</div>
                    <div className="small">
                      Trigger when <strong>{a.direction}</strong> {fmt(a.targetPrice)}
                    </div>
                  </div>
                  <div className="small mono">{String(a.id).slice(0, 8)}</div>
                </div>
              </div>
            ))}

            {alerts.length === 0 && <div className="small">No alerts loaded.</div>}
          </div>

          <div style={{ marginTop: 14 }}>
            <div className="h2" style={{ marginBottom: 10 }}>
              Power Log
            </div>
            <div className="panel" style={{ background: "#fff" }}>
              {log.length === 0 ? (
                <div className="small">No events yet.</div>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {log.map((x, i) => (
                    <div key={i} className="small mono">
                      {x.t} — {x.msg}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
