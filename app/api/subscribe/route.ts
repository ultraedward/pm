import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const source = typeof body.source === "string" ? body.source : "unknown";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    // Upsert — idempotent if they subscribe twice
    const subscriber = await prisma.emailSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email, source },
    });

    // Send welcome email if Resend is configured
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.RESEND_FROM ?? "Lode <onboarding@resend.dev>";
      const unsubUrl = `${process.env.NEXTAUTH_URL ?? "https://lode.rocks"}/api/unsubscribe?token=${subscriber.unsubscribeToken}`;

      await resend.emails.send({
        from,
        to: email,
        subject: "You're in — Monday prices coming your way",
        html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0907;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">
          <tr>
            <td style="padding-bottom:32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">Lode</p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:900;color:#fff;line-height:1.2;">You're in.</h1>
              <p style="margin:0;font-size:15px;color:#aaa;line-height:1.6;">
                Every Monday morning, live spot prices for gold, silver, platinum, and palladium land in your inbox. No app to open.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">
              <a href="https://lode.rocks"
                 style="display:inline-block;padding:13px 28px;background:#D4AF37;color:#000;font-weight:800;text-decoration:none;border-radius:999px;font-size:14px;">
                Check live prices →
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:11px;color:#444;line-height:1.6;">
                You subscribed at <a href="https://lode.rocks" style="color:#555;text-decoration:none;">lode.rocks</a>.
                Don't want these? <a href="${unsubUrl}" style="color:#555;text-decoration:none;">Unsubscribe</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
