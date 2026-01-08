import { prisma } from "@/lib/prisma";

export async function getAlertHistory() {
  return prisma.alertTrigger.findMany({
    orderBy: { triggeredAt: "desc" },
    take: 50,
    select: {
      id: true,
      price: true,
      triggeredAt: true,
      alert: {
        select: {
          metal: true,
          target: true,
          direction: true,
        },
      },
    },
  });
}

export default async function AlertHistory() {
  const rows = await getAlertHistory();

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex justify-between rounded border p-2 text-sm"
        >
          <span>
            {row.alert.metal.toUpperCase()} @{" "}
            {row.alert.target.toString()}
          </span>

          <span className="text-gray-500">
            {new Date(row.triggeredAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
