import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendAlertEmail } from "@/lib/email";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const alerts = await prisma.alert.findMany({
      where: {
        userId: user.id,
        active: true,
      },
    });

    await sendAlertEmail(
      user.email,
      alerts.map((a) => ({
        metal: a.metal,
        direction: a.direction,
        threshold: a.threshold,
      }))
    );

    return NextResponse.json({ sent: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Email failed" },
      { status: 400 }
    );
  }
}
