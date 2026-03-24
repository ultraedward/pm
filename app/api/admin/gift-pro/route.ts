import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/gift-pro
// Body: { email: string, months?: number, secret: string }
//
// Grants pro access to the user with the given email for `months` months (default 12).
// Protected by ADMIN_SECRET env var — keep this out of version control.
//
// Example:
//   curl -X POST https://lode.rocks/api/admin/gift-pro \
//     -H "Content-Type: application/json" \
//     -d '{"email":"influencer@example.com","months":12,"secret":"your-secret"}'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email, months = 12, secret } = body as {
    email?: string;
    months?: number;
    secret?: string;
  };

  // Auth check
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret || secret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  if (typeof months !== "number" || months < 1 || months > 120) {
    return NextResponse.json({ error: "months must be between 1 and 120" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: `No user found with email: ${email}` }, { status: 404 });
  }

  // If they already have gifted pro, extend from the later of now or their current proUntil
  const base = user.proUntil && user.proUntil > new Date() ? user.proUntil : new Date();
  const proUntil = new Date(base);
  proUntil.setMonth(proUntil.getMonth() + months);

  await prisma.user.update({
    where: { email },
    data: { proUntil },
  });

  return NextResponse.json({
    success: true,
    email,
    proUntil: proUntil.toISOString(),
    message: `${email} now has pro access until ${proUntil.toDateString()}`,
  });
}
