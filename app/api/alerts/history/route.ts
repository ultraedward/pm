import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ history: [] });
  }

  const logs = await prisma.emailLog.findMany({
    where: {
      to: session.user.email,
    },
    include: {
      alert: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const history = logs.map((log) => ({
    id: log.id,
    metal: log.alert?.metal ?? null,
    target: log.alert?.target ?? null, // ✅ FIXED
    direction: log.alert?.direction ?? null,
    status: log.status,
    sentAt: log.createdAt,
  }));

  return NextResponse.json({ history });
}