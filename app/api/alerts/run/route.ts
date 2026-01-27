import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cron/check-alerts`,
    { method: "GET" }
  );
  const json = await res.json();
  return NextResponse.json(json);
}