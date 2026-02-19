export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const holdings = await prisma.holding.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(holdings);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { metal, ounces, costBasis } = body;

  if (!metal || !ounces) {
    return NextResponse.json(
      { error: "Metal and ounces required" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // FREE LIMIT: max 1 holding per metal
  if (user.subscriptionStatus !== "active") {
    const existing = await prisma.holding.count({
      where: { userId: user.id, metal },
    });

    if (existing >= 1) {
      return NextResponse.json(
        { error: "Upgrade to Pro for multiple holdings." },
        { status: 403 }
      );
    }
  }

  const holding = await prisma.holding.create({
    data: {
      userId: user.id,
      metal,
      ounces: Number(ounces),
      costBasis: costBasis ? Number(costBasis) : null,
    },
  });

  return NextResponse.json(holding);
}