// app/dashboard/alerts/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const alerts = await prisma.alert.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Your Alerts</h1>

        {alerts.length === 0 ? (
          <p className="mt-6 text-gray-600">
            You don’t have any alerts yet.
          </p>
        ) : (
          <table className="mt-6 w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-2">Metal</th>
                <th className="pb-2">Threshold</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr
                  key={alert.id}
                  className="border-b last:border-b-0"
                >
                  <td className="py-3 font-medium capitalize">
                    {alert.metal}
                  </td>
                  <td className="py-3">
                    ${alert.threshold.toFixed(2)}
                  </td>
                  <td className="py-3">
                    {alert.active ? (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-600">
                        Paused
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-sm text-gray-500">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
