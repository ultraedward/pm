import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const { metal, type, price, percentValue, direction } = body;

    if (!metal || !type || !direction) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const alert = await prisma.alert.create({
      data: {
        userId: user.id,
        metal,
        type,
        price: type === "price" ? price : null,
        percentValue: type === "percent" ? percentValue : null,
        direction,
        active: true,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}
