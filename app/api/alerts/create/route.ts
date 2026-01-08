// app/api/alerts/create/route.ts
import { NextResponse } from "next/server";
import { requirePro } from "@/lib/requirePro";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { user } = await requirePro();

    const body = await req.json();
    const { metal, targetPrice, direction } = body;

    if (!metal || !targetPrice || !direction) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const alert = await prisma.alert.create({
      data: {
        userId: user.id,
        metal,
        targetPrice,
        direction,
      },
    });

    return NextResponse.json({ alert });
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
