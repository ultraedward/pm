import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Resolve DB user (session user has no id)
  const dbUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: { id: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: dbUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ alerts });
}
