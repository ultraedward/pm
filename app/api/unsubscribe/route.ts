import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  try {
    await prisma.emailSubscriber.update({
      where: { unsubscribeToken: token },
      data: { active: false },
    });
  } catch {
    // Token not found — treat as already unsubscribed
  }

  // Return a simple HTML confirmation
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Unsubscribed — Lode</title>
</head>
<body style="margin:0;padding:0;background:#0a0907;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;">
  <div style="max-width:400px;text-align:center;padding:40px 24px;">
    <p style="margin:0 0 24px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#D4AF37;">Lode</p>
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:900;color:#fff;">You're unsubscribed.</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#666;line-height:1.6;">You won't receive any more emails from Lode. Prices are still live at lode.rocks whenever you need them.</p>
    <a href="https://lode.rocks" style="display:inline-block;padding:12px 28px;background:#D4AF37;color:#000;font-weight:800;text-decoration:none;border-radius:999px;font-size:14px;">Back to Lode</a>
  </div>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
}
