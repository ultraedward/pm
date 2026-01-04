import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ alerts: [] });
  }

  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");
  if (!metal) {
    return NextResponse.json({ alerts: [] });
  }

  // 🔑 Resolve real DB user (this is the fix)
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!dbUser) {
    return NextResponse.json({ alerts: [] });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: dbUser.id,
      metal,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      metal: true,
      direction: true,
      threshold: true,
      active: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ alerts });
}
