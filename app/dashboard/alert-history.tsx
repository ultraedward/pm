import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function AlertHistory() {
  const user = await getCurrentUser();
  if (!user || !user.id) return null;

  const triggers = await prisma.alertTrigger.findMany({
    where: {
      userId: user.id,
      triggered: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      metal: true,
      price: true,
      createdAt: true,
      alert: {
        select: {
          direction: true,
          threshold: true,
        },
      },
    },
  });

  if (triggers.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-sm text-gray-500">
        No alert triggers yet.
      </div>
    );
  }

  return (
    <div className="border rounded-lg divide-y">
      {triggers.map((t) => (
        <div key={t.id} className="p-4 flex justify-between">
          <div>
            <div className="font-medium">
              {t.metal} {t.alert.direction} {t.alert.threshold}
            </div>
            <div className="text-xs text-gray-500">
              Triggered at {t.price}
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {t.createdAt.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
