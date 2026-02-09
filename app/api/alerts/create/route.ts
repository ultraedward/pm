import { requireUser } from "@/lib/requireUser";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await requireUser();
  const body = await req.json();

  const { metal, price, direction } = body;

  if (!metal || !price || !direction) {
    return Response.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  if (!["above", "below"].includes(direction)) {
    return Response.json(
      { error: "Invalid direction" },
      { status: 400 }
    );
  }

  const alert = await prisma.alert.create({
    data: {
      userId: user.id,
      metal: metal.toLowerCase(),
      price: Number(price),
      direction,
      active: true,
    },
  });

  return Response.json({ ok: true, alertId: alert.id });
}