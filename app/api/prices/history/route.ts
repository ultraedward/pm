import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // 🚨 TEMPORARY STUB
  // Price history is not backed by Prisma yet.
  // This keeps the build green and the API contract stable.

  return NextResponse.json({
    history: [],
  });
}