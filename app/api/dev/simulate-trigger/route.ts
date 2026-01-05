// app/api/dev/simulate-trigger/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  // 🔒 DEV-ONLY ROUTE
  // Disabled in production to prevent Prisma/type drift from blocking deploys

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "simulate-trigger is disabled in production" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { message: "simulate-trigger is available only in development" },
    { status: 200 }
  );
}
