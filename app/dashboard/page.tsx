import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {alerts.length === 0 && (
        <p className="text-gray-500">No alerts yet.</p>
      )}

      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="border p-3 rounded flex justify-between"
          >
            <span>
              {alert.metal} {alert.direction} {alert.threshold}
            </span>
            <span>{alert.enabled ? "ON" : "OFF"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
