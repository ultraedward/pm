import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!process.env.ADMIN_SECRET || auth !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      subscriptionStatus: true,
      _count: { select: { alerts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    total: users.length,
    pro: users.filter((u) => u.subscriptionStatus === "active").length,
    free: users.filter((u) => u.subscriptionStatus !== "active").length,
    users: users.map((u) => ({
      name: u.name,
      email: u.email,
      joined: u.createdAt,
      plan: u.subscriptionStatus === "active" ? "pro" : "free",
      alerts: u._count.alerts,
    })),
  });
}
