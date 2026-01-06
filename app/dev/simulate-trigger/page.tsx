import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SimulateTriggerPage() {
  const triggers = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Simulate Trigger</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(triggers, null, 2)}
      </pre>
    </div>
  );
}
