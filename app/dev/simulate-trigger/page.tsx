import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function SimulateTriggerPage() {
  const user = await getCurrentUser();

  // Hard gate: must be signed in
  if (!user || !user.id) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold">Simulate Trigger</h1>
        <p className="text-sm text-gray-500 mt-2">Not signed in</p>
      </div>
    );
  }

  // DEV-ONLY SAFETY: prevent accidental prod usage
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-xl font-semibold">Simulate Trigger</h1>
        <p className="text-sm text-red-600 mt-2">
          Disabled in production
        </p>
      </div>
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      metal: true,
      direction: true,
      threshold: true,
      active: true,
      createdAt: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Simulate Alert Trigger</h1>
        <p className="text-sm text-gray-500 mt-1">
          Dev-only tool. No emails sent. No prices moved.
        </p>
      </div>

      {alerts.length === 0 && (
        <p className="text-sm text-gray-500">
          You don’t have any alerts yet.
        </p>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <form
            key={alert.id}
            action="/api/dev/simulate-trigger"
            method="post"
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <input type="hidden" name="alertId" value={alert.id} />

            <div className="space-y-1">
              <div className="font-medium">
                {alert.metal} — {alert.direction} {alert.threshold}
              </div>
              <div className="text-xs text-gray-500">
                {alert.active ? "Active" : "Inactive"} ·{" "}
                {alert.createdAt.toLocaleString()}
              </div>
            </div>

            <button
              type="submit"
              disabled={!alert.active}
              className={`text-sm px-3 py-1 border rounded ${
                alert.active
                  ? "hover:bg-gray-50"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              Simulate
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
