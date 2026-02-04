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

  try {
    const history = await prisma.alertTrigger.findMany({
      where: {
        alert: {
          userId: session.user.id,
        },
      },
      orderBy: {
        triggeredAt: "desc",
      },
      take: 100,
      include: {
        alert: true,
      },
    });

    return NextResponse.json({ history });
  } catch (err) {
    console.error("alerts/history error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}