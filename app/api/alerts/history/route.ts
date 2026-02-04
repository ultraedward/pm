import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "user_not_found" },
        { status: 404 }
      );
    }

    const history = await prisma.emailLog.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      select: {
        id: true,
        metal: true,
        price: true,
        target: true,
        direction: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, history });
  } catch (err) {
    console.error("alerts/history error", err);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}