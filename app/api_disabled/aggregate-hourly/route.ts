import { prisma } from "../../../lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const since = new Date(Date.now() - 60 * 60 * 1000)

  const points = await prisma.pricePoint.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  })

  if (points.length === 0) {
    return Response.json({ ok: true, message: "No data" })
  }

  const byMetal = {
    gold: points.filter(p => p.metal === "gold"),
    silver: points.filter(p => p.metal === "silver"),
  }

  const aggregate = (arr: typeof points) => ({
    open: arr[0].price,
    close: arr[arr.length - 1].price,
    high: Math.max(...arr.map(p => p.price)),
    low: Math.min(...arr.map(p => p.price)),
  })

  return Response.json({
    ok: true,
    gold: byMetal.gold.length ? aggregate(byMetal.gold) : null,
    silver: byMetal.silver.length ? aggregate(byMetal.silver) : null,
  })
}
