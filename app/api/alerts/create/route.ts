import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { SUPPORTED_CURRENCIES } from "@/lib/fx";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const { metal, direction, type, price, percentValue, currency } = body;

    if (!metal || !direction || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (type === "price" && (!price || Number(price) <= 0)) {
      return new NextResponse("Invalid price value", { status: 400 });
    }

    if (type === "percent" && (!percentValue || Number(percentValue) <= 0)) {
      return new NextResponse("Invalid percent value", { status: 400 });
    }

    // Default to USD if the client sends an unrecognised currency
    const alertCurrency = SUPPORTED_CURRENCIES.includes(currency) ? currency : "USD";

    await prisma.alert.create({
      data: {
        userId: user.id,
        metal,
        direction,
        type,
        price: type === "price" ? Number(price) : 0,
        percentValue: type === "percent" ? Number(percentValue) : 0,
        currency: alertCurrency,
        active: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Create alert error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
