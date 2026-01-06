import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// 🔴 IMPORTANT: never prerender this API route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json(
      { error: "Missing metal parameter" },
      { status: 400 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { metal },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ alerts });
}
