import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

/*
  GET  -> fetch user's holdings
  POST -> create holding
*/

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
    orderBy: { purchaseDate: "desc" },
  });

  return NextResponse.json(holdings);
}

export async function POST(req: Request) {
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

  const body = await req.json();

  const { metal, ounces, purchasePrice, purchaseDate } = body;

  if (!metal || !ounces || !purchasePrice || !purchaseDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const holding = await prisma.holding.create({
    data: {
      userId: user.id,
      metal,
      ounces: Number(ounces),
      purchasePrice: Number(purchasePrice),
      purchaseDate: new Date(purchaseDate),
    },
  });

  return NextResponse.json(holding);
}