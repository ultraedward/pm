import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cronAuth";

export async function POST(req: NextRequest) {
  if (!requireCronAuth(req)) {
    return new NextResponse("unauthorized", { status: 401 });
  }

  // TODO: move prices logic here
  return NextResponse.json({ ok: true });
}