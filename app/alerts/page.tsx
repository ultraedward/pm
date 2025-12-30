import { prisma } from "../../lib/prisma";
import AlertFormClient from "../components/AlertFormClient";
import AdminOnly from "../components/AdminOnly";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    include: { metal: true },
    orderBy: { createdAt: "desc" },
  });

  const metals = await prisma.metal.findMany();

  return (
    <main className="p-4 md:p-8 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">
        Alerts
      </h1>

      <AdminOnly>
        <AlertFormClient metals={metals} />
      </AdminOnly>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-[600px] w-full border border-gray-800 text-sm">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-2 border border-gray-800">Metal</th>
              <th className="p-2 border border-gray-800">Condition</th>
              <th className="p-2 border border-gray-800">Target</th>
              <th className="p-2 border border-gray-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id} className="odd:bg-gray-800">
                <td className="p-2 border border-gray-800">
                  {a.metal.name}
                </td>
                <td className="p-2 border border-gray-800">
                  {a.condition}
                </td>
                <td className="p-2 border border-gray-800">
                  ${a.targetPrice.toFixed(2)}
                </td>
                <td className="p-2 border border-gray-800">
                  {a.triggered ? "Triggered" : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
