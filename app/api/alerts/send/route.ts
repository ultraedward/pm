import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const log = await prisma.emailLog.create({
    data: {
      to: session.user.email ?? "unknown@example.com",
      subject: "Test Alert",
      status: "sent",
      user: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  return NextResponse.json({
    ok: true,
    log,
  });
}
