import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const prices = await prisma.price.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ prices });
}
