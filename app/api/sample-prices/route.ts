// /app/api/sample-prices/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

/*
  PURE API ROUTE
  - No JSX
  - No path aliases
  - Self-contained Prisma client
*/

const prisma = new PrismaClient();

export async function GET() {
  const rows = await prisma.price.findMany({
    where: {
      metal: {
        in: ["XAU", "XAG", "XPT"],
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const result = {
    XAU: { price: 0 },
    XAG: { price: 0 },
    XPT: { price: 0 },
  };

  for (const row of rows) {
    if (row.metal === "XAU") result.XAU.price = row.price;
    if (row.metal === "XAG") result.XAG.price = row.price;
    if (row.metal === "XPT") result.XPT.price = row.price;
  }

  return NextResponse.json(result);
}
