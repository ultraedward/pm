"use client";

import { useTransition } from "react";

type Alert = {
  id: string;
  metal: string;
  price: number;
  direction: string;
  active: boolean;
  lastTriggeredAt: Date | null;
};

export function AlertsTable({ alerts }: { alerts: Alert[] }) {
  const [isPending, startTransition] = useTransition();

  async function toggleAlert(id: string) {
    await fetch(`/api/alerts/${id}/toggle`, { method: "POST" });
    location.reload();
  }

  async function deleteAlert(id: string) {
    if (!confirm("Delete this alert?")) return;
    await fetch(`/api/alerts/${id}/delete`, { method: "POST" });
    location.reload();
  }

  return (
    <div className="overflow-hidden rounded border border-gray-800">
      <table className="w-full text-sm">
        <thead className="bg-gray-900 text-gray-400">
          <tr>
            <th className="px-4 py-3 text-left">Metal</th>
            <th className="px-4 py-3 text-left">Condition</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Last triggered</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-800">
          {alerts.map((alert) => (
            <tr key={alert.id} className="bg-black hover:bg-gray-900">
              <td className="px-4 py-3 capitalize font-medium">
                {alert.metal}
              </td>

              <td className="px-4 py-3">
                {alert.direction} ${alert.price.toLocaleString()}
              </td>

              <td className="px-4 py-3">
                {alert.active ? (
                  <span className="rounded bg-green-600/20 px-2 py-1 text-xs text-green-400">
                    Active
                  </span>
                ) : (
                  <span className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-400">
                    Paused
                  </span>
                )}
              </td>

              <td className="px-4 py-3 text-gray-400">
                {alert.lastTriggeredAt
                  ? new Date(alert.lastTriggeredAt).toLocaleDateString()
                  : "—"}
              </td>

              <td className="px-4 py-3 text-right space-x-2">
                <button
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => toggleAlert(alert.id))
                  }
                  className="rounded border border-gray-700 px-2 py-1 text-xs hover:bg-gray-800"
                >
                  {alert.active ? "Pause" : "Resume"}
                </button>

                <button
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => deleteAlert(alert.id))
                  }
                  className="rounded border border-red-800 px-2 py-1 text-xs text-red-400 hover:bg-red-900/20"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}