import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { ok: false, pro: false },
      { status: 401 }
    );
  }

  // 🚨 TEMP STUB
  // No Subscription model exists in Prisma.
  // Treat all users as FREE for now.

  return NextResponse.json({
    ok: true,
    pro: false,
    source: "stub",
  });
}