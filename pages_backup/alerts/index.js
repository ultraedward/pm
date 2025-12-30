import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [lastTick, setLastTick] = useState(Date.now());
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const r = await fetch("/api/alerts").then((x) => x.json());
    setAlerts(r.alerts || []);
    setLastTick(Date.now());
  };

  const triggerCheck = async () => {
    setBusy(true);
    try {
      await fetch("/api/cron/check-alerts").then((x) => x.json());
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="row" style={{ marginBottom: 18 }}>
        <div>
          <div className="h1">Alerts</div>
          <div className="subhead">
            This is the product. Alerts are observable, testable, and always accessible.
          </div>
        </div>
        <div className="small mono">
          last refresh: <strong>{Math.round((Date.now() - lastTick) / 1000)}s</strong> ago
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div className="h2">Active Alerts</div>
          <div className="panel-actions">
            <a className="btn" href="/">
              Dashboard
            </a>
            <a className="btn" href="/charts">
              Charts
            </a>
            <button className="btn btn-primary" onClick={refresh}>
              Refresh
            </button>
            <button className="btn" onClick={triggerCheck} disabled={busy}>
              Trigger Alert Check
            </button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="th">Metal</th>
              <th className="th">Direction</th>
              <th className="th">Target</th>
              <th className="th">Status</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td className="td">
                  <strong>{a.metal?.name}</strong>
                </td>
                <td className="td">
                  <span className="pill">{a.direction}</span>
                </td>
                <td className="td mono">
                  <strong>${Number(a.targetPrice).toFixed(2)}</strong>
                </td>
                <td className="td">
                  <span className="small">visible (evaluation via cron/check)</span>
                </td>
              </tr>
            ))}
            {alerts.length === 0 && (
              <tr>
                <td className="td" colSpan={4}>
                  <span className="small">No alerts found.</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }} className="small">
          Next: add per-alert “last evaluated” + “why not triggered” explanations (true power tester mode).
        </div>
      </div>
    </>
  );
}
