// app/dashboard/alerts/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AlertActions from "./alert-actions";

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const alerts = await prisma.alert.findMany({
    where: {
      user: { email: session.user.email },
    },
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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your Alerts</h1>

          <Link
            href="/dashboard/alerts/new"
            className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            New Alert
          </Link>
        </div>

        {alerts.length === 0 ? (
          <p className="mt-6 text-gray-600">You don’t have any alerts yet.</p>
        ) : (
          <table className="mt-6 w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="pb-2">Metal</th>
                <th className="pb-2">Direction</th>
                <th className="pb-2">Threshold</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id} className="border-b last:border-b-0">
                  <td className="py-3 capitalize">{alert.metal}</td>
                  <td className="py-3 capitalize">{alert.direction}</td>
                  <td className="py-3">
                    ${Number(alert.threshold).toFixed(2)}
                  </td>
                  <td className="py-3">{alert.active ? "Active" : "Paused"}</td>
                  <td className="py-3">
                    <AlertActions id={alert.id} active={alert.active} />
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
