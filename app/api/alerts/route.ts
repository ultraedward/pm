import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const user = await requireUser();
  const { allowed } = await canCreateAlert(user.id);

  if (!allowed) {
    return NextResponse.json(
      { error: "Free plan limit reached" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const alert = await prisma.alert.create({
    data: {
      userId: user.id,
      metal: body.metal,
      price: body.price,
      direction: body.direction,
    },
  });

  return NextResponse.json(alert);
}