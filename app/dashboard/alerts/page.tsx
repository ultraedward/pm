"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: string;
  metal: string;
  target: number;
  direction: string;
  active: boolean;
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/alerts");
        const data = await res.json();

        setAlerts(Array.isArray(data.alerts) ? data.alerts : []);
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p>Loading alerts…</p>;
  }

  if (alerts.length === 0) {
    return <p>No alerts yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {alerts.map((e) => (
        <li
          key={e.id}
          className="rounded border p-3 flex justify-between items-center"
        >
          <div>
            <p className="font-medium">
              {e.metal.toUpperCase()} {e.direction} ${e.target.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Status: {e.active ? "Active" : "Inactive"}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}