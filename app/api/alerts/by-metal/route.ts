import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: { metal: string } }
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const metal = params.metal.toUpperCase();

  const alerts = await prisma.alert.findMany({
    where: {
      userId: user.id,
      metal,
    },
    select: {
      id: true,
      metal: true,
      direction: true,
      threshold: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(alerts);
}
