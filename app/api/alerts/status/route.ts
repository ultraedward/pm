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

  const lastAlert = await prisma.alert.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      triggers: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      emailLogs: { // ✅ FIX (was `emails`)
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  return NextResponse.json({
    lastTriggerAt:
      lastAlert?.triggers?.[0]?.createdAt ??
      lastAlert?.emailLogs?.[0]?.createdAt ??
      null,
  });
}