import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs"; // required for Prisma on Vercel

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    if (!process.env.METALS_API_KEY) {
      throw new Error("Missing METALS_API_KEY");
    }

    const url = `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Metals API failed: ${text}`);
    }

    const data = await res.json();

    console.log("Metals API response:", JSON.stringify(data, null, 2));

    if (!data.success) {
      throw new Error("Metals API returned success=false");
    }

    if (!data.rates?.XAU || !data.rates?.XAG) {
      throw new Error("Missing XAU or XAG in response");
    }

    /**
     * Metals API with base=USD returns:
     * rates.XAU = how much 1 USD is worth in gold
     * To get USD per ounce:
     * price = 1 / rate
     */

    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    // Basic sanity guardrails
    if (goldPrice < 1000 || goldPrice > 10000) {
      throw new Error(`Gold price looks invalid: ${goldPrice}`);
    }

    if (silverPrice < 5 || silverPrice > 500) {
      throw new Error(`Silver price looks invalid: ${silverPrice}`);
    }

    await prisma.price.createMany({
      data: [
        {
          metal: "gold",
          price: goldPrice,
          source: "metals-api",
        },
        {
          metal: "silver",
          price: silverPrice,
          source: "metals-api",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
    });
  } catch (err: any) {
    console.error("Cron failed:", err.message || err);
    return new NextResponse("Cron failed", { status: 500 });
  }
}