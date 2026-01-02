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
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }

  if (!isValidEmail(user.email)) {
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

  // 🚨 Import Resend ONLY at runtime, never at build
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

  return NextResponse.json({ sent: true });
}
