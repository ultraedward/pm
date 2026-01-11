// app/api/stripe/portal/route.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE
// Stripe portal disabled until Stripe fields are added to User model

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      error: "Stripe billing is not enabled yet",
    },
    { status: 501 }
  );
}
