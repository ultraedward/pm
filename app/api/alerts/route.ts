import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export async function POST(req: Request) {
  await requireAdmin();

  const body = await req.json();

  const alert = await prisma.alert.create({
    data: {
      metalId: body.metalId,
      condition: body.condition,
      targetPrice: Number(body.targetPrice),
    },
  });

  return Response.json(alert);
}
