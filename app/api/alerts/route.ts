import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const alert = await prisma.alert.create({
    data: {
      metal: body.metal,
      targetPrice: body.targetPrice,
      direction: body.direction,
      userId: session.user.id,
    },
  });

  return NextResponse.json(alert);
}
