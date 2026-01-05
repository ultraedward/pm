// app/api/dev/whoami/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);

  return NextResponse.json({
    ok: true,
    hasSession: !!session,
    session,
  });
}
