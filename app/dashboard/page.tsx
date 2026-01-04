import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createAlert, toggleAlert, deleteAlert } from "./actions";

export default async function DashboardPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser?.email) {
    return <div className="p-8">Not authenticated</div>;
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: { id: true },
  });

  if (!dbUser) {
    return <div className="p-8">User not found</div>;
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage your precious metal alerts
        </p>
      </div>

      {/* Alerts */}
      <div className="space-y-4">
        {alerts.length === 0 && (
          <div className="text-sm text-gray-500">No alerts yet</div>
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between border rounded-lg px-4 py-3"
          >
            <div>
              <div className="font-medium">
                {alert.metal} {alert.direction} {alert.threshold}
              </div>
              <div className="text-xs text-gray-500">
                {alert.active ? "Active" : "Paused"}
              </div>
            </div>

            <div className="flex gap-2">
              <form action={toggleAlert}>
                <input type="hidden" name="alertId" value={alert.id} />
                <button className="text-sm px-3 py-1 border rounded">
                  Toggle
                </button>
              </form>

              <form action={deleteAlert}>
                <input type="hidden" name="alertId" value={alert.id} />
                <button className="text-sm px-3 py-1 border rounded text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Create Alert */}
      <form
        action={createAlert}
        className="border rounded-lg p-4 space-y-3"
      >
        <div className="font-medium">Create Alert</div>

        <input
          name="metal"
          placeholder="Gold / Silver"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <select
          name="direction"
          className="w-full border px-3 py-2 rounded"
        >
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>

        <input
          name="threshold"
          type="number"
          step="0.01"
          placeholder="Price"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Create Alert
        </button>
      </form>
    </div>
  );
}
