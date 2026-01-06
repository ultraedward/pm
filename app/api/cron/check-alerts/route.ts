import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    OK: "THIS IS THE NEW ROUTE",
    time: new Date().toISOString(),
  });
}
