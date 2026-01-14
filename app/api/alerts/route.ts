import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/alerts
 * Used by dashboard alerts page
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      metal: true,
      targetPrice: true,
      direction: true,
      createdAt: true,
    },
  });

  return NextResponse.json(alerts);
}

/**
 * POST /api/alerts
 * Create new alert
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { metal, targetPrice, direction } = body;

  if (!metal || !targetPrice || !direction) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const alert = await prisma.alert.create({
    data: {
      metal,
      targetPrice,
      direction,
      userId: session.user.id,
    },
  });

  return NextResponse.json(alert);
}
