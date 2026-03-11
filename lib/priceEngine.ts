import { prisma } from "@/lib/prisma";

export async function updateMetalsPrices() {
  try {
    const response = await fetch("https://api.metals.live/v1/spot", {
      cache: "no-store"
    });

    const data = await response.json();

    const gold = data?.find((m: any) => m.gold)?.gold ?? null;
    const silver = data?.find((m: any) => m.silver)?.silver ?? null;

    if (!gold || !silver) {
      throw new Error("Metals API returned invalid data");
    }

    const timestamp = new Date();

    await prisma.price.createMany({
      data: [
        { metal: "gold", price: gold, timestamp },
        { metal: "silver", price: silver, timestamp }
      ]
    });

    return { gold, silver };

  } catch (error) {
    console.error("Price engine failure:", error);

    return {
      gold: null,
      silver: null
    };
  }
}