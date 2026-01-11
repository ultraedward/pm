// app/api/stripe/webhook/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// Stripe webhook disabled until Stripe fields exist on User model

import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Stripe webhook endpoint
 * Currently disabled until billing is implemented
 */
export async function POST() {
  return NextResponse.json(
    {
      received: true,
      message: "Stripe webhook received but billing is not enabled",
    },
    { status: 200 }
  );
}
