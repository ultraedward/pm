import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ alerts: [] });

  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json({ alerts: [] });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: user.id,
      metal,
      active: true,
    },
    select: {
      id: true,
      threshold: true,
      direction: true,
    },
  });

  return NextResponse.json({ alerts });
}
