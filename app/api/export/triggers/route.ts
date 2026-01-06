import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const triggers = await prisma.alertTrigger.findMany();

  return NextResponse.json({ triggers });
}
