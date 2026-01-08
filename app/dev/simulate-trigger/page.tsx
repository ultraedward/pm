import { prisma } from "@/lib/prisma";

export default async function SimulateTriggerPage() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { triggeredAt: "desc" },
    take: 10,
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

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-lg font-semibold">Recent Alert Triggers</h1>

      {triggers.map((t) => (
        <div
          key={t.id}
          className="flex justify-between rounded border p-2 text-sm"
        >
          <span>
            {t.alert.metal.toUpperCase()} @{" "}
            {t.alert.target.toString()}
          </span>

          <span className="text-gray-500">
            {new Date(t.triggeredAt).toLocaleString()}
          </span>
        </div>
      ))}
    </main>
  );
}
