import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const logs = await prisma.emailLog.findMany({
    where: {
      alert: {
        userId: session.user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
    select: {
      id: true,
      to: true,
      subject: true,
      status: true,
      createdAt: true,
      alert: {
        select: {
          metal: true,
          target: true,
          direction: true,
        },
      },
    },
  });

  return NextResponse.json({
    history: logs.map((l) => ({
      id: l.id,
      sentTo: l.to,
      status: l.status,
      createdAt: l.createdAt,
      metal: l.alert.metal,
      target: l.alert.target,
      direction: l.alert.direction,
    })),
  });
}