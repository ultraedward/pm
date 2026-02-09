"use client";

import { useState } from "react";
import { Toast } from "@/components/Toast";

type Alert = {
  id: string;
  metal: string;
  price: number;
  direction: string;
  active: boolean;
  lastTriggeredAt: string | null;
};

export function AlertsTable({ alerts: initial }: { alerts: Alert[] }) {
  const [alerts, setAlerts] = useState(initial);
  const [toast, setToast] = useState<string | null>(null);

  async function toggleAlert(id: string) {
    setAlerts(prev =>
      prev.map(a =>
        a.id === id ? { ...a, active: !a.active } : a
      )
    );

    const res = await fetch("/api/alerts/toggle", {
      method: "POST",
      body: JSON.stringify({ alertId: id }),
    });

    if (!res.ok) {
      // rollback
      setAlerts(initial);
      setToast("Failed to update alert");
      return;
    }

    setToast("Alert updated");
  }

  async function deleteAlert(id: string) {
    const ok = confirm("Delete this alert?");
    if (!ok) return;

    const prev = alerts;
    setAlerts(prev.filter(a => a.id !== id));

    const res = await fetch("/api/alerts/delete", {
      method: "POST",
      body: JSON.stringify({ alertId: id }),
    });

    if (!res.ok) {
      setAlerts(prev);
      setToast("Failed to delete alert");
      return;
    }

    setToast("Alert deleted");
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-700 p-6 text-center">
        <p className="text-lg font-medium">No alerts yet</p>
        <p className="mt-1 text-sm text-gray-400">
          Create an alert to get notified when prices move.
        </p>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast} />}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="p-3">Metal</th>
              <th className="p-3">Condition</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Triggered</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map(alert => (
              <tr
                key={alert.id}
                className="border-b border-gray-900 hover:bg-gray-900/40"
              >
                <td className="p-3 capitalize">{alert.metal}</td>

                <td className="p-3">
                  {alert.direction} ${alert.price}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="underline"
                  >
                    {alert.active ? "Active" : "Paused"}
                  </button>
                </td>

                <td className="p-3 text-gray-400">
                  {alert.lastTriggeredAt
                    ? new Date(alert.lastTriggeredAt).toLocaleString()
                    : "Never"}
                </td>

                <td className="p-3 text-right">
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="text-red-400 underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}