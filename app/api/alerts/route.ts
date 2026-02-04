import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: session.user.id, // ✅ FIX
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ alerts });
}