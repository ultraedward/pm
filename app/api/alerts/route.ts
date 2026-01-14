import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    // ✅ NOT LOGGED IN → EMPTY LIST (NOT 401)
    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    const alerts = await prisma.alert.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        metal: true,
        direction: true,
        targetPrice: true,
      },
    });

    return NextResponse.json(alerts);
  } catch {
    // ✅ HARD FAIL SAFE
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const alert = await prisma.alert.create({
      data: {
        userId: session.user.id,
        metal: body.metal,
        direction: body.direction,
        targetPrice: body.targetPrice,
      },
    });

    return NextResponse.json(alert);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
