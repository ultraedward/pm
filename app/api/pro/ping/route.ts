// app/api/pro/ping/route.ts
import { NextResponse } from "next/server";
import { requirePro } from "@/lib/requirePro";

export async function GET() {
  try {
    const { user } = await requirePro();
    return NextResponse.json({
      ok: true,
      message: "PRO access confirmed",
      userId: user.id,
    });
  } catch (err: any) {
    const msg = String(err?.message || "");

    if (msg === "AUTH_REQUIRED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (msg === "PRO_REQUIRED") {
      return NextResponse.json({ error: "PRO required" }, { status: 403 });
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
