import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");

  if (!metal) {
    return NextResponse.json(
      { error: "Missing metal parameter" },
      { status: 400 }
    );
  }

  // Schema-safe placeholder response
  return NextResponse.json({
    metal,
    price: null,
    previousPrice: null,
    change: null,
    updatedAt: new Date().toISOString(),
  });
}
