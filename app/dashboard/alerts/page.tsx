"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: string;
  metal: string;
  direction: "ABOVE" | "BELOW";
  targetPrice: number;
  createdAt: string;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAlerts() {
    try {
      const res = await fetch("/api/alerts", { cache: "no-store" });

      if (!res.ok) {
        setAlerts([]);
        return;
      }

      const data = await res.json();

      // 🔒 HARD GUARANTEE ARRAY
      setAlerts(Array.isArray(data) ? data : []);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteAlert(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    loadAlerts();
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Alerts</h1>

      {alerts.length === 0 && (
        <p className="text-sm text-gray-500">No alerts yet.</p>
      )}

      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center gap-2 border rounded px-3 py-2"
          >
            <span>
              {a.metal} {a.direction} {a.targetPrice}
            </span>
            <button
              onClick={() => deleteAlert(a.id)}
              className="text-red-600 hover:text-red-800"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
