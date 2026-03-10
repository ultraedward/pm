import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const API_KEY = process.env.METALS_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing METALS_API_KEY" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.metals-api.com/v1/latest?access_key=${API_KEY}&base=USD&symbols=XAU,XAG`,
      { cache: "no-store" }
    );

    const data = await res.json();

    if (!data.success) {
      return NextResponse.json(
        { error: "Metals API failed" },
        { status: 500 }
      );
    }

    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    const now = new Date();

    await prisma.price.createMany({
      data: [
        {
          metal: "gold",
          price: goldPrice,
          timestamp: now,
        },
        {
          metal: "silver",
          price: silverPrice,
          timestamp: now,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
    });
  } catch (error) {
    console.error("Cron price error:", error);

    return NextResponse.json(
      { error: "Cron update failed" },
      { status: 500 }
    );
  }
}