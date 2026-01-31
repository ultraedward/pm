"use client";

import { useEffect, useState } from "react";
import { useProStatus } from "@/lib/useProStatus";
import { UpgradeButton } from "@/components/UpgradeButton";

type Alert = {
  id: string;
  metal: string;
  target: number;
  direction: "above" | "below";
  active: boolean;
};

export default function AlertsPage() {
  const { pro, loading } = useProStatus();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/alerts")
      .then((res) => res.json())
      .then(setAlerts)
      .catch(() => setError("Failed to load alerts"));
  }, []);

  if (loading) return null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Price Alerts</h1>

      {!pro && (
        <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="mb-2 font-medium text-amber-900">
            🔒 Alerts are paused on the free plan
          </p>
          <p className="mb-3 text-sm text-amber-800">
            Upgrade to Pro to receive real-time email alerts when prices hit
            your targets.
          </p>
          <UpgradeButton />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {alerts.length === 0 && (
        <p className="text-gray-500">No alerts yet.</p>
      )}

      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="rounded border p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {alert.metal.toUpperCase()} {alert.direction} $
                {alert.target.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Status: {alert.active ? "Active" : "Inactive"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}