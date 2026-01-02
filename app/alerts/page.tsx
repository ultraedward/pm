"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: string;
  metal: string;
  direction: "above" | "below";
  threshold: number;
  active: boolean;
};

type EmailLog = {
  id: string;
  status: string;
  error?: string;
  createdAt: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [metal, setMetal] = useState("Gold");
  const [direction, setDirection] = useState<"above" | "below">("above");
  const [threshold, setThreshold] = useState<number>(2000);
  const [sending, setSending] = useState(false);

  async function load() {
    const a = await fetch("/api/alerts").then((r) => r.json());
    const l = await fetch("/api/email-logs").then((r) => r.json());
    setAlerts(a.alerts || []);
    setLogs(l.logs || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createAlert() {
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metal, direction, threshold }),
    });
    load();
  }

  async function toggle(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "PATCH" });
    load();
  }

  async function sendTestEmail() {
    setSending(true);
    await fetch("/api/alerts/send", { method: "POST" });
    setSending(false);
    load();
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Alerts</h1>

      <section style={{ marginTop: 16 }}>
        <select value={metal} onChange={(e) => setMetal(e.target.value)}>
          <option>Gold</option>
          <option>Silver</option>
          <option>Platinum</option>
          <option>Palladium</option>
        </select>

        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as any)}
          style={{ marginLeft: 8 }}
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>

        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          style={{ marginLeft: 8, width: 120 }}
        />

        <button
          onClick={createAlert}
          style={{ marginLeft: 8, padding: "6px 12px" }}
        >
          Add Alert
        </button>
      </section>

      <section style={{ marginTop: 16 }}>
        <button
          onClick={sendTestEmail}
          disabled={sending}
          style={{
            padding: "6px 12px",
            background: "#000",
            color: "#fff",
            borderRadius: 6,
          }}
        >
          {sending ? "Sending…" : "Send test email"}
        </button>
      </section>

      <h3 style={{ marginTop: 32 }}>Email delivery log</h3>
      <ul>
        {logs.map((l) => (
          <li key={l.id}>
            {new Date(l.createdAt).toLocaleString()} —{" "}
            <strong>{l.status}</strong>
            {l.error ? ` (${l.error})` : ""}
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 32 }}>Alerts</h3>
      <ul>
        {alerts.map((a) => (
          <li key={a.id} style={{ marginBottom: 8 }}>
            {a.metal} {a.direction} {a.threshold} —{" "}
            <strong>{a.active ? "ON" : "OFF"}</strong>{" "}
            <button onClick={() => toggle(a.id)} style={{ marginLeft: 8 }}>
              Toggle
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
