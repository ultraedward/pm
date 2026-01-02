"use client";

import { useEffect, useState } from "react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [metal, setMetal] = useState("Gold");
  const [direction, setDirection] = useState("above");
  const [threshold, setThreshold] = useState(2000);
  const [cooldownHours, setCooldownHours] = useState(24);

  async function load() {
    const res = await fetch("/api/alerts/history");
    const data = await res.json();
    setAlerts(data.alerts);
  }

  useEffect(() => {
    load();
  }, []);

  async function createAlert() {
    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metal,
        direction,
        threshold,
        cooldownHours,
      }),
    });
    load();
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Alerts</h1>

      <section>
        <select onChange={(e) => setMetal(e.target.value)}>
          <option>Gold</option>
          <option>Silver</option>
          <option>Platinum</option>
          <option>Palladium</option>
        </select>

        <select onChange={(e) => setDirection(e.target.value)}>
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>

        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />

        <select
          value={cooldownHours}
          onChange={(e) => setCooldownHours(Number(e.target.value))}
        >
          <option value={1}>1 hour</option>
          <option value={6}>6 hours</option>
          <option value={24}>24 hours</option>
        </select>

        <button onClick={createAlert}>Add Alert</button>
      </section>

      <h3 style={{ marginTop: 24 }}>Your Alerts</h3>
      <ul>
        {alerts.map((a) => (
          <li key={a.id}>
            {a.metal} {a.direction} {a.threshold} — cooldown{" "}
            {a.cooldownHours}h
          </li>
        ))}
      </ul>
    </main>
  );
}
