import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SimulateTriggerPage() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Dev: Simulated Triggers
      </h1>

      <ul className="space-y-2 text-sm">
        {triggers.map((t) => (
          <li key={t.id} className="border rounded p-2">
            Alert: {t.alertId} — ${t.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
