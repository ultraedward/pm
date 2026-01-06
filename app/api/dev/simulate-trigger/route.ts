import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST() {
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
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Grab the most recent active alert
  const alert = await prisma.alert.findFirst({
    where: { userId: user.id, active: true },
    orderBy: { createdAt: "desc" },
  });

  if (!alert) {
    return NextResponse.json(
      { error: "No active alerts found" },
      { status: 400 }
    );
  }

  // Create trigger record
  const trigger = await prisma.alertTrigger.create({
    data: {
      alertId: alert.id,
      userId: user.id,
      price: alert.threshold,
      triggered: true,
    },
  });

  // Log email (NO sending yet)
  await prisma.emailLog.create({
    data: {
      userId: user.id,
      to: user.email,
      subject: `Alert triggered: ${alert.metal}`,
      status: "queued",
    },
  });

  return NextResponse.json({
    ok: true,
    triggerId: trigger.id,
    emailLogged: true,
  });
}
