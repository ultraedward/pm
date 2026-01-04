import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
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

  const { searchParams } = new URL(req.url);
  const hours = Number(searchParams.get("hours") ?? 24);

  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const triggers = await prisma.alertTrigger.findMany({
    where: {
      userId: dbUser.id,
      triggered: true,
      createdAt: { gte: since },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ triggers });
}
