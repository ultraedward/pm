import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  // ✅ ALWAYS read headers this way in App Router
  const headerList = headers();
  const auth = headerList.get("authorization");

  const secret = process.env.CRON_SECRET;

  // 🔍 TEMP DEBUG (safe to remove later)
  console.log("CRON AUTH CHECK", {
    hasAuthHeader: !!auth,
    authHeader: auth,
    hasSecret: !!secret,
  });

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET missing on server" },
      { status: 500 }
    );
  }

  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  // 🔒 If we got here, auth is GOOD
  const alerts = await prisma.alert.findMany({
    where: { active: true },
  });

  return NextResponse.json({
    ok: true,
    authorized: true,
    alertsChecked: alerts.length,
  });
}