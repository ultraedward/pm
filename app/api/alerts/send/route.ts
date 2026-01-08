// app/api/alerts/send/route.ts
import { NextResponse } from "next/server";
import { requirePro } from "@/lib/requirePro";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    await requirePro();

    // Your existing alert-send logic likely lives here
    // This endpoint must NEVER run for free users

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.message === "AUTH_REQUIRED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (err.message === "PRO_REQUIRED") {
      return NextResponse.json({ error: "PRO plan required" }, { status: 403 });
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
