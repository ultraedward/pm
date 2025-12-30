// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();

  if (password !== process.env.APP_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("pm_auth", "true", {
    httpOnly: true,
    path: "/",
  });

  return res;
}
