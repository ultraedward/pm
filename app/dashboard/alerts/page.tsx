import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Alerts</h1>
      <pre className="text-sm bg-gray-100 p-4 rounded">
        {JSON.stringify(alerts, null, 2)}
      </pre>
    </div>
  );
}
