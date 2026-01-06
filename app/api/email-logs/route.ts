import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { logs: [], warning: "User not found" },
        { status: 200 }
      );
    }

    // EmailLog model exists (migration-fixed)
    const logs = await prisma.emailLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Email logs error:", error);

    return NextResponse.json(
      {
        logs: [],
        warning: "EmailLog table unavailable or query failed",
      },
      { status: 200 }
    );
  }
}
