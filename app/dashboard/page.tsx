import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createAlert, toggleAlert, deleteAlert } from "./actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Account type: <strong>Free</strong>
        </p>
      </div>

      {/* Create Alert */}
      <form action={createAlert} className="space-y-4 border rounded-lg p-4">
        <h2 className="font-medium">Create Alert</h2>

        <div className="grid grid-cols-3 gap-3">
          <select name="metal" className="border rounded px-2 py-1">
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
          </select>

          <select name="direction" className="border rounded px-2 py-1">
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>

          <input
            name="threshold"
            type="number"
            step="0.01"
            required
            className="border rounded px-2 py-1"
            placeholder="Price"
          />
        </div>

        <button className="px-4 py-2 bg-black text-white rounded">
          Create Alert
        </button>
      </form>

      {/* Alerts List */}
      <div className="space-y-3">
        <h2 className="font-medium">Your Alerts</h2>

        {alerts.length === 0 && (
          <p className="text-sm text-gray-500">No alerts yet.</p>
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">
                {alert.metal.toUpperCase()} {alert.direction}{" "}
                {alert.threshold}
              </div>
              <div className="text-xs text-gray-500">
                {alert.active ? "Active" : "Disabled"}
              </div>
            </div>

            <div className="flex gap-2">
              <form action={toggleAlert}>
                <input type="hidden" name="id" value={alert.id} />
                <button className="text-sm underline">
                  {alert.active ? "Disable" : "Enable"}
                </button>
              </form>

              <form action={deleteAlert}>
                <input type="hidden" name="id" value={alert.id} />
                <button className="text-sm text-red-600 underline">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
