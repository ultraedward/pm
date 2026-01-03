import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.metalId || !body?.targetPrice || !body?.direction) {
      return Response.json({ error: "Invalid payload" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      select: { id: true, stripeStatus: true },
    });

    if (!user || user.stripeStatus !== "active") {
      return Response.json(
        { error: "Pro subscription required" },
        { status: 403 }
      );
    }

    const alert = await prisma.alert.create({
      data: {
        userId: user.id,
        metalId: body.metalId,
        targetPrice: Number(body.targetPrice),
        direction: body.direction,
      },
    });

    return Response.json(alert);
  } catch {
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
