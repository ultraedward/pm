// app/dashboard/alert-history.tsx

import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AlertHistoryPage() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Alert History</h1>

      <div className="border rounded-md divide-y">
        {triggers.map((t) => (
          <div key={t.id} className="p-3 text-sm flex justify-between">
            <div>
              <div className="font-medium">{t.metal.toUpperCase()}</div>
              <div className="text-gray-500">
                Triggered at ${t.price}
              </div>
            </div>
            <div className="text-gray-400">
              {new Date(t.createdAt).toLocaleString()}
            </div>
          </div>
        ))}

        {triggers.length === 0 && (
          <div className="p-4 text-gray-500 text-sm">
            No alert history yet.
          </div>
        )}
      </div>
    </div>
  );
}
