import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { getUserSubscription } from "@/lib/billing/getUserSubscription";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const {
      metal,
      type, // "price" | "percent"
      price,
      percentValue,
      direction, // "above" | "below"
    } = body;

    if (!metal || !type || !direction) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const subscription = await getUserSubscription(
      user.id
    );

    const isPro =
      subscription?.status === "active";

    const existingAlerts =
      await prisma.alert.count({
        where: {
          userId: user.id,
          active: true,
        },
      });

    // 🔥 FREE LIMIT: 1 alert max
    if (!isPro && existingAlerts >= 1) {
      return NextResponse.json(
        {
          error:
            "Free plan allows only 1 active alert. Upgrade to Pro for unlimited alerts.",
        },
        { status: 403 }
      );
    }

    const alert = await prisma.alert.create({
      data: {
        userId: user.id,
        metal,
        type,
        price: type === "price" ? price : null,
        percentValue:
          type === "percent"
            ? percentValue
            : null,
        direction,
        active: true,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}