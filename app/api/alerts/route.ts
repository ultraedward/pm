import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { metal, direction, threshold } = body;

  if (!metal || !direction || !threshold) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  // 🔑 FETCH USER FROM DATABASE (not session)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      stripeStatus: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isPro = user.stripeStatus === "active";
  const MAX_FREE_ALERTS = 1;

  if (!isPro) {
    const count = await prisma.alert.count({
      where: { userId: user.id },
    });

    if (count >= MAX_FREE_ALERTS) {
      return NextResponse.json(
        { error: "Upgrade to Pro to create more alerts" },
        { status: 403 }
      );
    }
  }

  const alert = await prisma.alert.create({
    data: {
      userId: user.id,
      metal,
      direction,
      threshold,
      enabled: true,
    },
  });

  return NextResponse.json(alert);
}
