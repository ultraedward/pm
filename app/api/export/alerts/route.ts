import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const alerts = await prisma.alert.findMany();

  return NextResponse.json({ alerts });
}
