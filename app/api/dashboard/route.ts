import { NextResponse } from "next/server";

type Range = "24h" | "7d" | "30d";

function rangeToSince(range: Range) {
  const now = Date.now();

  switch (range) {
    case "24h":
      return new Date(now - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now - 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now - 24 * 60 * 60 * 1000);
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") as Range) ?? "24h";

  // Schema-safe placeholder response
  return NextResponse.json({
    range,
    since: rangeToSince(range).toISOString(),
    metals: [],
  });
}
