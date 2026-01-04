import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Resolve DB user first (session user has no id)
  const dbUser = await prisma.user.findUnique({
    where: { email: sessionUser.email },
    select: { id: true },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const rows = await prisma.alertTrigger.findMany({
    where: {
      userId: dbUser.id,
      triggered: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ triggers: rows });
}
