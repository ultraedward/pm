import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { getUserSubscription } from "@/lib/billing/getUserSubscription";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();

    const { metal, type, direction, price, percentValue } = body;

    if (!metal || !direction || !type) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const subscription = await getUserSubscription(user.id);
    const isPro = subscription?.status === "active";

    // 🔒 FREE TIER LIMIT: Only 1 active alert
    if (!isPro) {
      const activeCount = await prisma.alert.count({
        where: {
          userId: user.id,
          active: true,
        },
      });

      if (activeCount >= 1) {
        return NextResponse.json(
          {
            error:
              "Free users can only have 1 active alert. Upgrade to Pro for unlimited alerts.",
          },
          { status: 403 }
        );
      }
    }

    // 🔒 FREE TIER LIMIT: No percent alerts
    if (!isPro && type === "percent") {
      return NextResponse.json(
        {
          error:
            "Percent-based alerts are a Pro feature. Upgrade to unlock.",
        },
        { status: 403 }
      );
    }

    // Validation
    if (type === "price" && !price) {
      return NextResponse.json(
        { error: "Price is required for price alerts." },
        { status: 400 }
      );
    }

    if (type === "percent" && !percentValue) {
      return NextResponse.json(
        { error: "Percent value required for percent alerts." },
        { status: 400 }
      );
    }

    const alert = await prisma.alert.create({
      data: {
        userId: user.id,
        metal,
        type,
        direction,
        price: type === "price" ? Number(price) : null,
        percentValue:
          type === "percent" ? Number(percentValue) : null,
        active: true,
      },
    });

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Alert creation error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}