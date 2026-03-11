import { prisma } from "@/lib/prisma";

const TEN_MINUTES = 10 * 60 * 1000;
const GRAMS_PER_TROY_OUNCE = 31.1035;

export async function updateMetalsPrices() {
  try {
    const latest = await prisma.price.findFirst({
      orderBy: { timestamp: "desc" }
    });

    const now = Date.now();

    // Return cached prices if they are fresh
    if (latest && now - new Date(latest.timestamp).getTime() < TEN_MINUTES) {
      const latestPrices = await prisma.price.findMany({
        orderBy: { timestamp: "desc" },
        take: 2
      });

      const gold = latestPrices.find(p => p.metal === "gold")?.price ?? null;
      const silver = latestPrices.find(p => p.metal === "silver")?.price ?? null;

      return {
        ok: true,
        gold,
        silver,
        source: "database"
      };
    }

    // Fetch fresh prices
    const response = await fetch(
      `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`,
      { cache: "no-store" }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error("Metals API request failed");
    }

    // Convert from grams → troy ounces
    const gold = Number((data.rates.XAU * GRAMS_PER_TROY_OUNCE).toFixed(2));
    const silver = Number((data.rates.XAG * GRAMS_PER_TROY_OUNCE).toFixed(2));

    const timestamp = new Date();

    await prisma.price.createMany({
      data: [
        { metal: "gold", price: gold, timestamp },
        { metal: "silver", price: silver, timestamp }
      ]
    });

    return {
      ok: true,
      gold,
      silver,
      source: "api"
    };

  } catch (error) {
    console.error("Price engine failure:", error);

    return {
      ok: false,
      gold: null,
      silver: null,
      source: "error"
    };
  }
}