import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma"; // ✅ FIXED IMPORT

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const { metal, target, direction } = body;

  if (!metal || !target || !direction) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const alert = await prisma.alert.create({
    data: {
      userId: session.user.id,
      metal,
      price: Number(target), // canonical field
      direction,
      active: true,
    },
  });

  return NextResponse.json({ alert });
}