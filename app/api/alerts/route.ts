import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ alerts: [] });
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ alerts });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { metal, direction, threshold } = await req.json();

  // 🔒 Deduplication check
  const existing = await prisma.alert.findFirst({
    where: {
      userId: user.id,
      metal,
      direction,
      threshold,
    },
  });

  if (existing) {
    return NextResponse.json({ alert: existing });
  }

  const alert = await prisma.alert.create({
    data: {
      metal,
      direction,
      threshold,
      userId: user.id,
    },
  });

  return NextResponse.json({ alert });
}
