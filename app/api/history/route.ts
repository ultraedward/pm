import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const gold = await prisma.price.findMany({
      where: { metal: "gold" },
      orderBy: { timestamp: "asc" },
      take: 30,
    });

    const silver = await prisma.price.findMany({
      where: { metal: "silver" },
      orderBy: { timestamp: "asc" },
      take: 30,
    });

    return NextResponse.json({
      gold,
      silver,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}