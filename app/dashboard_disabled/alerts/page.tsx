import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const alerts = await prisma.alert.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      metal: true,
      targetPrice: true,
      direction: true,
      createdAt: true,
    },
  });

  return (
    <div style={{ padding: 24 }}>
      <h1>Alerts (disabled)</h1>
      <pre>{JSON.stringify(alerts, null, 2)}</pre>
    </div>
  );
}
