import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
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

  const body = await req.json();
  const { metal, direction, threshold } = body;

  if (!metal || !direction || typeof threshold !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const alert = await prisma.alert.create({
    data: {
      userId: dbUser.id,
      metal,
      direction,
      threshold,
      active: true, // schema-safe
    },
  });

  return NextResponse.json({ alert });
}
