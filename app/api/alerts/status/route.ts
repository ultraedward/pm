import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      triggers: {
        orderBy: [
          {
            triggeredAt: "desc",
          },
        ],
        take: 1,
      },
      emails: {
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ alerts });
}