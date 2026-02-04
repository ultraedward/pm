import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ history: [] });
  }

  const history = await prisma.emailLog.findMany({
    where: {
      alert: {
        userId: session.user.id,
      },
    },
    orderBy: {
      sentAt: "desc",
    },
    take: 50,
    select: {
      id: true,
      to: true,
      subject: true,
      status: true,
      sentAt: true,
      alertId: true,
    },
  });

  return NextResponse.json({ history });
}