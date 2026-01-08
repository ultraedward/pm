// app/api/alerts/history/route.ts
import { NextResponse } from "next/server";
import { requirePro } from "@/lib/requirePro";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { user } = await requirePro();

    const alerts = await prisma.alert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts });
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
