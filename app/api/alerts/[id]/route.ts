import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "Alerts temporarily disabled" },
    { status: 501 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: "Alerts temporarily disabled" },
    { status: 501 }
  );
}
