import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ ok: false, error: "no_user" }, { status: 404 });
  }

  const logs = await prisma.emailLog.findMany({
    where: {
      alert: { userId: user.id },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      alert: true,
    },
  });

  return NextResponse.json({ ok: true, logs });
}