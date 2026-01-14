"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: string;
  metal: string;
  direction: "ABOVE" | "BELOW";
  targetPrice: number;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/alerts", {
          credentials: "include",
        });

        const data = await res.json();

        // ✅ HARD GUARD
        if (Array.isArray(data)) {
          setAlerts(data);
        } else {
          setAlerts([]);
        }
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function remove(id: string) {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    setAlerts((a) => a.filter((x) => x.id !== id));
  }

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading alerts…</div>;
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-lg font-semibold mb-4">Your Alerts</h1>

      {alerts.length === 0 && (
        <div className="text-sm text-gray-500">
          No alerts yet.
        </div>
      )}

      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className="flex justify-between items-center border rounded px-3 py-2 text-sm"
          >
            <span>
              {a.metal} {a.direction} {a.targetPrice}
            </span>
            <button
              onClick={() => remove(a.id)}
              className="text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
