import { prisma } from "@/lib/prisma";

export default async function AlertHistory() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      alert: true,
    },
  });

  if (triggers.length === 0) {
    return <p className="text-sm text-gray-500">No alerts triggered yet.</p>;
  }

  return (
    <div className="space-y-3">
      {triggers.map((t) => (
        <div
          key={t.id}
          className="rounded border p-3 text-sm flex justify-between"
        >
          <div>
            <div className="font-medium">
              {t.alert.metal.toUpperCase()} {t.alert.direction}{" "}
              {t.alert.threshold}
            </div>
            <div className="text-gray-500">
              Triggered at ${t.price}
            </div>
          </div>
          <div className="text-gray-400">
            {new Date(t.createdAt).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
