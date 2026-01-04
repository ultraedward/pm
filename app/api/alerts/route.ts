import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { metal, direction, threshold } = body;

  if (!metal || !direction || !threshold) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  // 🚫 STRIPE DISABLED — ALL USERS ARE FREE
  const MAX_FREE_ALERTS = 1;

  const existingCount = await prisma.alert.count({
    where: { userId: session.user.id },
  });

  if (existingCount >= MAX_FREE_ALERTS) {
    return NextResponse.json(
      { error: "Free tier limit reached" },
      { status: 403 }
    );
  }

  const alert = await prisma.alert.create({
    data: {
      userId: session.user.id,
      metal,
      direction,
      threshold,
      enabled: true,
    },
  });

  return NextResponse.json(alert);
}
