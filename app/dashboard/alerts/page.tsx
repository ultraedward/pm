"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: string;
  metal: string;
  targetPrice: number;
  direction: "ABOVE" | "BELOW";
};

export default function AlertsPage() {
  const [metal, setMetal] = useState("gold");
  const [direction, setDirection] = useState<"ABOVE" | "BELOW">("ABOVE");
  const [price, setPrice] = useState("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  function loadAlerts() {
    fetch("/api/alerts")
      .then((r) => r.json())
      .then(setAlerts);
  }

  useEffect(loadAlerts, []);

  async function submit() {
    setLoading(true);

    await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metal,
        targetPrice: price,
        direction,
      }),
    });

    setPrice("");
    loadAlerts();
    setLoading(false);
  }

  async function remove(id: string) {
    await fetch(`/api/alerts?id=${id}`, { method: "DELETE" });
    loadAlerts();
  }

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-xl font-bold">Create Alert</h1>

      <div className="space-y-2">
        <select value={metal} onChange={(e) => setMetal(e.target.value)}>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="platinum">Platinum</option>
          <option value="palladium">Palladium</option>
        </select>

        <select
          value={direction}
          onChange={(e) => setDirection(e.target.value as any)}
        >
          <option value="ABOVE">Above</option>
          <option value="BELOW">Below</option>
        </select>

        <input
          type="number"
          placeholder="Target price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button disabled={loading} onClick={submit}>
          {loading ? "Saving..." : "Create Alert"}
        </button>
      </div>

      <div>
        <h2 className="font-semibold">Your Alerts</h2>

        <ul className="space-y-2">
          {alerts.map((a) => (
            <li key={a.id} className="flex justify-between gap-2">
              <span>
                {a.metal} {a.direction} {a.targetPrice}
              </span>
              <button onClick={() => remove(a.id)}>❌</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
