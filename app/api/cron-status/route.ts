import { prisma } from "../../../lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const last = await prisma.pricePoint.findFirst({
    orderBy: { createdAt: "desc" },
  })

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const count24h = await prisma.pricePoint.count({
    where: { createdAt: { gte: since } },
  })

  return Response.json({
    ok: true,
    lastRun: last?.createdAt ?? null,
    rowsLast24h: count24h,
    expectedPer24h: 288, // every 10 minutes = 6/hr * 24
    healthy: count24h > 200,
  })
}
