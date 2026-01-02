export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    await prisma.emailLog.create({
      data: {
        userId: user.id,
        status: "failed",
        error: "RESEND_API_KEY not configured",
      },
    });

    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  if (!isValidEmail(user.email)) {
    await prisma.emailLog.create({
      data: {
        userId: user.id,
        status: "failed",
        error: "Invalid email address",
      },
    });

    return NextResponse.json(
      { error: "Invalid email address" },
      { status: 400 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: user.id,
      active: true,
    },
  });

  if (!alerts.length) {
    return NextResponse.json({ sent: false, reason: "No active alerts" });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <h2>Precious Metals Alerts</h2>
      <p>Your active alerts:</p>
      <ul>
        ${alerts
          .map(
            (a) =>
              `<li>${a.metal} ${a.direction} ${a.threshold}</li>`
          )
          .join("")}
      </ul>
    `;

    await resend.emails.send({
      from: process.env.ALERT_EMAIL_FROM!,
      to: user.email,
      subject: "Your Precious Metals Alerts",
      html,
    });

    await prisma.emailLog.create({
      data: {
        userId: user.id,
        status: "sent",
      },
    });

    return NextResponse.json({ sent: true });
  } catch (err: any) {
    await prisma.emailLog.create({
      data: {
        userId: user.id,
        status: "failed",
        error: err.message ?? "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Email failed to send" },
      { status: 500 }
    );
  }
}
