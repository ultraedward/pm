import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await requireUser();
  const { alertId } = await req.json();

  const alert = await prisma.alert.findFirst({
    where: {
      id: alertId,
      userId: user.id,
    },
  });

  if (!alert) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.alert.update({
    where: { id: alertId },
    data: { active: !alert.active },
  });

  return Response.json({ ok: true });
}