import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { canCreateAlert } from "@/lib/alerts/canCreateAlert";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const { metal, direction, type, price, percentValue } = body;

    // ---- Plan Limit Check ----
    const { allowed } = await canCreateAlert(user.id);
    if (!allowed) {
      return new NextResponse("Upgrade required", { status: 402 });
    }

    // ---- Validation ----
    if (!metal || !direction || !type) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (type === "price" && (!price || Number(price) <= 0)) {
      return new NextResponse("Invalid price value", { status: 400 });
    }

    if (type === "percent" && (!percentValue || Number(percentValue) <= 0)) {
      return new NextResponse("Invalid percent value", { status: 400 });
    }

    // ---- Create Alert ----
    await prisma.alert.create({
      data: {
        userId: user.id,
        metal,
        direction,
        type, // "price" | "percent"
        price: type === "price" ? Number(price) : 0,
        percentValue: type === "percent" ? Number(percentValue) : 0,
        active: true,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Create alert error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}