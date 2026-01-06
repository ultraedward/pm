import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const logs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(logs);
}
