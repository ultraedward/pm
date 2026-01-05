// app/api/alerts/create/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { metal, threshold } = body;

  if (!metal || !threshold) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const alert = await prisma.alert.create({
    data: {
      metal,
      threshold,
      active: true,
      user: {
        connect: {
          email: session.user.email,
        },
      },
    },
  });

  return NextResponse.json(alert);
}
