import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const API_KEY = process.env.METALS_API_KEY;

  const res = await fetch(
    `https://metals-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=XAU,XAG`
  );

  const data = await res.json();

  const gold = 1 / data.rates.XAU;
  const silver = 1 / data.rates.XAG;

  const now = new Date();

  await prisma.price.create({
    data: {
      metal: "gold",
      price: gold,
      timestamp: now,
    },
  });

  await prisma.price.create({
    data: {
      metal: "silver",
      price: silver,
      timestamp: now,
    },
  });

  return Response.json({ success: true });
}