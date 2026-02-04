import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email"; // ✅ FIXED IMPORT

export async function GET() {
  const alert = await prisma.alert.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  if (!alert) {
    return NextResponse.json({ ok: false, error: "No alert found" });
  }

  await sendEmail({
    to: "test@example.com",
    subject: "Simulated Alert Trigger",
    html: `
      <h2>Simulated Alert</h2>
      <p><b>Metal:</b> ${alert.metal}</p>
      <p><b>Direction:</b> ${alert.direction}</p>
      <p><b>Price:</b> ${alert.price}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}