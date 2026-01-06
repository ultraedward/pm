import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const history = await prisma.alertTrigger.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(history);
}
