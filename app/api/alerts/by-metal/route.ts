import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const metal = searchParams.get("metal");
  const take = Number(searchParams.get("take") ?? 5);

  if (!metal) {
    return NextResponse.json({ error: "Missing metal" }, { status: 400 });
  }

  const rows = await prisma.alertTrigger.findMany({
    where: {
      Alert: {
        metal,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take,
  });

  return NextResponse.json(rows);
}
