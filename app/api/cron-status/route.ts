import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cron: "ingest-prices",
    schedule: "daily",
    status: "configured",
    timestamp: new Date().toISOString(),
  });
}
