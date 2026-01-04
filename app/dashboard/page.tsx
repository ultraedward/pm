import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return (
      <div className="p-8 text-sm text-gray-500">
        Not authenticated
      </div>
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <section>
        <h2 className="text-lg font-medium mb-2">Alerts</h2>

        {alerts.length === 0 && (
          <p className="text-sm text-gray-500">No alerts found.</p>
        )}

        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="flex justify-between items-center border rounded px-3 py-2 text-sm"
            >
              <span>
                {alert.metal} {alert.direction} {alert.threshold}
              </span>

              {/* All alerts are implicitly active */}
              <span className="text-green-600 font-medium">ON</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
