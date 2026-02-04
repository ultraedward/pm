import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const logs = await prisma.emailLog.findMany({
    where: {
      to: session.user.email,
    },
    orderBy: {
      sentAt: "desc",
    },
    take: 50,
    include: {
      alert: true,
    },
  });

  const history = logs.map((log) => ({
    id: log.id,
    metal: log.alert?.metal ?? null,
    target: log.alert?.target ?? null, // ✅ FIXED
    direction: log.alert?.direction ?? null,
    sentTo: log.to,
    status: log.status,
    createdAt: log.sentAt,
  }));

  return NextResponse.json({ history });
}