import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { rateLimit } from "../../../lib/rateLimit";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "local";

  // Rate limit: 5 attempts per minute per IP
  if (rateLimit(`login:${ip}`, 5, 60_000)) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  const { password } = await req.json();

  if (password !== process.env.APP_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  const res = NextResponse.json({ ok: true });

  res.cookies.set("pm_auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.cookies.set("pm_user", user?.email ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}
