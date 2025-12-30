// app/api/cron/move-prices/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

function randomPercent(min: number, max: number) {
  return (Math.random() * (max - min) + min) / 100
}

export async function GET() {
  const metals = await prisma.metal.findMany()

  const updates = await Promise.all(
    metals.map(async (metal) => {
      const pctMove = randomPercent(-0.6, 0.6)
      const newPrice = Number((metal.price * (1 + pctMove)).toFixed(2))

      await prisma.priceHistory.create({
        data: {
          metalId: metal.id,
          price: newPrice
        }
      })

      return prisma.metal.update({
        where: { id: metal.id },
        data: { price: newPrice }
      })
    })
  )

  return NextResponse.json({
    status: "ok",
    moved: updates.length,
    timestamp: new Date().toISOString()
  })
}
