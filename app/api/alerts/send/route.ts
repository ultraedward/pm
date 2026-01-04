import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  // ✅ Prevent build-time crash
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email disabled (missing RESEND_API_KEY)" },
      { status: 200 }
    );
  }

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const user = await getCurrentUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await resend.emails.send({
    from: "alerts@yourdomain.com",
    to: user.email,
    subject: "Test Alert",
    html: "<p>Your alert system is working.</p>",
  });

  return NextResponse.json({ ok: true });
}
