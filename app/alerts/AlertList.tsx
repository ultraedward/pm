"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: string;
  metal: string;
  direction: string;
  target: number;
  frequency: string;
  active: boolean;
  trailingOffset?: number | null;
};

export default function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/alerts");
    const data = await res.json();
    setAlerts(data);
    setLoading(false);
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this alert?")) return;
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (!alerts.length) return <p>No alerts yet.</p>;

  return (
    <div className="space-y-4">
      {alerts.map((a) => (
        <div
          key={a.id}
          className="border rounded p-4 flex justify-between items-center"
        >
          <div>
            <div className="font-medium capitalize">
              {a.metal} {a.direction} ${a.target}
            </div>
            <div className="text-sm text-gray-500">
              {a.frequency.replaceAll("_", " ")}
              {a.frequency === "trailing_stop" &&
                ` (offset ${a.trailingOffset})`}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => toggle(a.id, !a.active)}
              className="px-3 py-1 border rounded"
            >
              {a.active ? "Pause" : "Resume"}
            </button>
            <button
              onClick={() => remove(a.id)}
              className="px-3 py-1 border rounded text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}