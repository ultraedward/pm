import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ history: [] });
  }

  const logs = await prisma.emailLog.findMany({
    where: {
      alert: {
        userId: session.user.id,
      },
    },
    include: {
      alert: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const history = logs.map((log) => ({
    id: log.id,
    metal: log.alert?.metal ?? null,
    target: log.alert?.target ?? null,
    direction: log.alert?.direction ?? null,
    status: log.status,
    sentAt: log.createdAt,
  }));

  return NextResponse.json({ history });
}