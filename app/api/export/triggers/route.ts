import { prisma } from "@/lib/prisma";
import { toCSV } from "@/lib/csv";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const hours = Number(searchParams.get("hours") ?? 48);

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const rows = await prisma.alertTrigger.findMany({
    where: {
      userId: user.id,
      triggered: true,
      createdAt: { gte: since },
    },
    include: {
      alert: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const csv = toCSV(
    rows.map((r) => ({
      metal: r.metal,
      price: r.price,
      direction: r.alert.direction,
      threshold: r.alert.threshold,
      timestamp: r.createdAt.toISOString(),
    }))
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="alert-triggers.csv"`,
    },
  });
}
