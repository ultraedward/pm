// app/api/alerts/create/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// FIX: requirePro no longer returns NextResponse

import { NextResponse } from "next/server";
import { requirePro } from "@/lib/requirePro";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // Auth check only (pro gating disabled)
    await requirePro();

    const body = await req.json();
    const { metal, direction, target } = body;

    if (!metal || !direction || !target) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const sessionUserId = body.userId;
    if (!sessionUserId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const alert = await prisma.alert.create({
      data: {
        userId: sessionUserId,
        metal,
        direction,
        target,
      },
    });

    return NextResponse.json({ ok: true, alert });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unable to create alert" },
      { status: 500 }
    );
  }
}
