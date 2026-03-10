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

    const response = await fetch(
      `https://api.metals-api.com/v1/latest?access_key=${API_KEY}&base=USD&symbols=XAU,XAG`,
      { cache: "no-store" }
    );

    const data = await response.json();

    if (!data.success) {
      console.error("Metals API error:", data);
      return NextResponse.json(
        { error: "Metals API failed" },
        { status: 500 }
      );
    }

    // ⚠️ metals-api returns oz per USD so we invert it
    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    if (!goldPrice || !silverPrice) {
      return NextResponse.json(
        { error: "Invalid price data" },
        { status: 500 }
      );
    }

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
    console.error("Update price error:", error);

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}import { NextResponse } from "next/server";
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

    const response = await fetch(
      `https://api.metals-api.com/v1/latest?access_key=${API_KEY}&base=USD&symbols=XAU,XAG`,
      { cache: "no-store" }
    );

    const data = await response.json();

    if (!data.success) {
      console.error("Metals API error:", data);
      return NextResponse.json(
        { error: "Metals API failed" },
        { status: 500 }
      );
    }

    // ⚠️ metals-api returns oz per USD so we invert it
    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    if (!goldPrice || !silverPrice) {
      return NextResponse.json(
        { error: "Invalid price data" },
        { status: 500 }
      );
    }

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
    console.error("Update price error:", error);

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}