import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message: "Alerts temporarily disabled",
    },
    { status: 501 }
  );
}
