import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { metal, direction } = body;

  if (!metal || !direction) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const alert = await prisma.alert.create({
    data: {
      userId: user.id,
      metal,
      direction,
    },
  });

  return NextResponse.json(alert);
}
