import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs = await prisma.alertTrigger.findMany({
    where: {
      alert: {
        user: {
          email: session.user.email,
        },
      },
    },
    orderBy: {
      triggeredAt: "desc",
    },
    take: 100,
    select: {
      id: true,
      price: true,
      triggeredAt: true,
      alert: {
        select: {
          metal: true,
          direction: true,
          price: true,
        },
      },
    },
  });

  return NextResponse.json(logs);
}