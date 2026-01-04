import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ alerts: [] });
  }

  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json({ alerts: [] });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: user.id,
      metal,
      enabled: true, // ✅ schema-correct
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      metal: true,
      direction: true,
      threshold: true,
      enabled: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ alerts });
}
