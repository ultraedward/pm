import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const apiKey = process.env.METALS_API_KEY;

    if (!apiKey) {
      throw new Error("METALS_API_KEY missing");
    }

    const url = `https://metals-api.com/api/latest?access_key=${apiKey}&base=USD&symbols=XAU,XAG`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      throw new Error("Invalid API response");
    }

    const goldPrice = data.rates?.USDXAU;
    const silverPrice = data.rates?.USDXAG;

    const timestamp = new Date();

    await prisma.price.create({
      data: {
        metal: "gold",
        price: goldPrice,
        timestamp,
      },
    });

    await prisma.price.create({
      data: {
        metal: "silver",
        price: silverPrice,
        timestamp,
      },
    });

    return NextResponse.json({
      success: true,
      gold: goldPrice,
      silver: silverPrice,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}