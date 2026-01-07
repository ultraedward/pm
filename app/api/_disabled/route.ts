import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: false,
    disabled: true,
    reason: "Feature temporarily disabled during schema stabilization",
  });
}

export async function POST() {
  return NextResponse.json({
    ok: false,
    disabled: true,
    reason: "Feature temporarily disabled during schema stabilization",
  });
}
