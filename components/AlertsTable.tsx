"use client";

type Alert = {
  id: string;
  metal: string;
  price: number;
  direction: string;
  active: boolean;
  lastTriggeredAt: string | null;
};

export function AlertsTable({ alerts }: { alerts: Alert[] }) {
  async function toggleAlert(id: string) {
    await fetch("/api/alerts/toggle", {
      method: "POST",
      body: JSON.stringify({ alertId: id }),
    });
    window.location.reload();
  }

  async function deleteAlert(id: string) {
    if (!confirm("Delete this alert?")) return;

    await fetch("/api/alerts/delete", {
      method: "POST",
      body: JSON.stringify({ alertId: id }),
    });
    window.location.reload();
  }

  if (alerts.length === 0) {
    return <p className="text-gray-400">No alerts yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="p-2 text-left">Metal</th>
          <th className="p-2 text-left">Condition</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Last Triggered</th>
          <th className="p-2"></th>
        </tr>
      </thead>
      <tbody>
        {alerts.map(a => (
          <tr key={a.id} className="border-b border-gray-800">
            <td className="p-2 capitalize">{a.metal}</td>
            <td className="p-2">
              {a.direction} {a.price}
            </td>
            <td className="p-2">
              <button className="underline" onClick={() => toggleAlert(a.id)}>
                {a.active ? "Active" : "Paused"}
              </button>
            </td>
            <td className="p-2">
              {a.lastTriggeredAt
                ? new Date(a.lastTriggeredAt).toLocaleString()
                : "Never"}
            </td>
            <td className="p-2">
              <button
                onClick={() => deleteAlert(a.id)}
                className="text-red-400 underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}