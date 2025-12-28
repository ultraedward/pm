import { PrismaClient } from "@prisma/client"

export const dynamic = "force-dynamic"

const prisma = new PrismaClient()

export async function GET() {
  const res = await fetch(
    `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    return Response.json({ ok: false, error: "fetch failed" }, { status: 500 })
  }

  const data = await res.json()

  const gold = data?.rates?.USDXAU
  const silver = data?.rates?.USDXAG

  if (typeof gold !== "number" || typeof silver !== "number") {
    return Response.json(
      { ok: false, error: "invalid price data" },
      { status: 500 }
    )
  }

  await prisma.pricePoint.createMany({
    data: [
      { metal: "gold", price: gold },
      { metal: "silver", price: silver },
    ],
  })

  return Response.json({
    ok: true,
    gold,
    silver,
    insertedAt: new Date().toISOString(),
  })
}
