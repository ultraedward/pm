import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // ✅ Only allow Vercel Cron
    const cronHeader = request.headers.get("x-vercel-cron");

    if (!cronHeader) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const API_KEY = process.env.METALS_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing METALS_API_KEY" },
        { status: 500 }
      );
    }

    // Fetch latest prices (Gold & Silver)
    const response = await fetch(
      `https://api.metals-api.com/v1/latest?access_key=${API_KEY}&base=USD&symbols=XAU,XAG`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!data.success) {
      console.error("Metals API error:", data);
      return NextResponse.json(
        { error: "Metals API failed" },
        { status: 500 }
      );
    }

    const goldPrice = data.rates.XAU;
    const silverPrice = data.rates.XAG;

    if (!goldPrice || !silverPrice) {
      return NextResponse.json(
        { error: "Invalid price data" },
        { status: 500 }
      );
    }

    // Save to database
    await prisma.price.createMany({
      data: [
        {
          metal: "gold",
          price: goldPrice,
          source: "metals-api",
          timestamp: new Date(),
        },
        {
          metal: "silver",
          price: silverPrice,
          source: "metals-api",
          timestamp: new Date(),
        },
      ],
    });

    return NextResponse.json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
    });
  } catch (error) {
    console.error("Cron error:", error);

    return NextResponse.json(
      { error: "Cron failed" },
      { status: 500 }
    );
  }
}