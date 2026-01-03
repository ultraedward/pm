import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const metal = searchParams.get("metal");
  const hoursParam = searchParams.get("hours");

  if (!metal) {
    return NextResponse.json(
      { error: "Missing metal parameter" },
      { status: 400 }
    );
  }

  const hours = hoursParam ? Number(hoursParam) : 24;

  if (Number.isNaN(hours) || hours <= 0) {
    return NextResponse.json(
      { error: "Invalid hours parameter" },
      { status: 400 }
    );
  }

  // Schema-safe placeholder history
  return NextResponse.json({
    metal,
    hours,
    data: [],
    generatedAt: new Date().toISOString(),
  });
}
