import { prisma } from "@/lib/prisma";
import { compressPrices } from "@/lib/compressPrices";

export async function updateMetalsPrices() {
  const response = await fetch("https://api.metals.live/v1/spot");

  const data = await response.json();

  const gold = data.find((m: any) => m.gold)?.gold;
  const silver = data.find((m: any) => m.silver)?.silver;

  if (!gold || !silver) {
    throw new Error("Invalid metals API response");
  }

  const now = new Date();

  await prisma.price.createMany({
    data: [
      {
        metal: "gold",
        price: gold,
        timestamp: now
      },
      {
        metal: "silver",
        price: silver,
        timestamp: now
      }
    ]
  });

  // compress database automatically
  await compressPrices();

  return { gold, silver };
}