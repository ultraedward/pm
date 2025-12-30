"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function saveAlertSettings(formData: FormData) {
  const gold = Number(formData.get("gold"))
  const silver = Number(formData.get("silver"))

  const existing = await prisma.alertSettings.findFirst()

  if (existing) {
    await prisma.alertSettings.update({
      where: { id: existing.id },
      data: { goldThreshold: gold, silverThreshold: silver },
    })
  } else {
    await prisma.alertSettings.create({
      data: { goldThreshold: gold, silverThreshold: silver },
    })
  }
}
