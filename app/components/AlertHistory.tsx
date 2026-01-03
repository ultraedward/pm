"use client";

import { useEffect, useState } from "react";

type Alert = {
  id: string;
  targetPrice: number;
  direction: string;
  triggered: boolean;
  createdAt: string;
  metal: {
    name: string;
    symbol: string;
  };
};

export default function AlertHistory() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/alerts/history");
        const data = await res.json();
        setAlerts(data.alerts ?? []);
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading alerts…</div>;
  }

  if (alerts.length === 0) {
    return (
      <div className="text-gray-500">
        No alerts created yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="border rounded-xl p-4 flex items-center justify-between"
        >
          <div>
            <div className="font-medium">
              {alert.metal.name} ({alert.metal.symbol})
            </div>
            <div className="text-sm text-gray-500">
              {alert.direction} ${alert.targetPrice.toFixed(2)}
            </div>
          </div>

          <div
            className={`text-sm font-medium ${
              alert.triggered
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            {alert.triggered ? "Triggered" : "Active"}
          </div>
        </div>
      ))}
    </div>
  );
}
