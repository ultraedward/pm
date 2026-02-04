import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { alerts: [] }, // ✅ ALWAYS array
      { status: 200 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: {
      email: session.user.email,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ alerts });
}