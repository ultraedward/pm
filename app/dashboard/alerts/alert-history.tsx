// app/dashboard/alerts/alert-history.tsx

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function getAlertHistory() {
  return prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export default async function AlertHistory() {
  const history = await getAlertHistory();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Alert History</h2>

      <div className="rounded border divide-y">
        {history.map((item) => (
          <div key={item.id} className="p-3 text-sm flex justify-between">
            <div>
              <div className="font-medium">
                {item.metal.toUpperCase()}
              </div>
              <div className="text-gray-500">
                Triggered at ${item.price}
              </div>
            </div>
            <div className="text-gray-400">
              {new Date(item.createdAt).toLocaleString()}
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="p-4 text-sm text-gray-500">
            No alert history available.
          </div>
        )}
      </div>
    </div>
  );
}
