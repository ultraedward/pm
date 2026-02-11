import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const res = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`
    );

    if (!res.ok) {
      throw new Error("Metals API failed");
    }

    const data = await res.json();

    const goldPrice = 1 / data.rates.XAU;
    const silverPrice = 1 / data.rates.XAG;

    await prisma.price.createMany({
      data: [
        {
          metal: "gold",
          price: goldPrice,
          source: "metals-api"
        },
        {
          metal: "silver",
          price: silverPrice,
          source: "metals-api"
        }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cron failed:", err);
    return new NextResponse("Cron failed", { status: 500 });
  }
}