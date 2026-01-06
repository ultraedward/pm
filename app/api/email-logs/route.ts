import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

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
    });

    if (!user) {
      return NextResponse.json(
        { logs: [], note: "User not found" },
        { status: 200 }
      );
    }

    const logs = await prisma.emailLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        to: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ logs });
  } catch (err) {
    console.error("Email logs error:", err);

    return NextResponse.json(
      {
        logs: [],
        warn: "EmailLog model exists, but logging is not yet wired to delivery",
      },
      { status: 200 }
    );
  }
}
