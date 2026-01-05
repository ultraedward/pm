import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  req: Request,
  { params }: { params: { metal: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const metal = params.metal;

  const alerts = await prisma.alert.findMany({
    where: {
      userId: session.user.id,
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
