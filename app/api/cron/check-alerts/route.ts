import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    OK: "THIS IS THE NEW ROUTE",
    time: new Date().toISOString(),
  });
}
