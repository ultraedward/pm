import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  // DEV-ONLY SAFETY
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Disabled in production" },
      { status: 403 }
    );
  }

  const user = await getCurrentUser();
  if (!user || !user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const alertId = formData.get("alertId");

  if (!alertId || typeof alertId !== "string") {
    return NextResponse.json({ error: "Invalid alertId" }, { status: 400 });
  }

  const alert = await prisma.alert.findFirst({
    where: {
      id: alertId,
      userId: user.id,
      active: true,
    },
  });

  if (!alert) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }

  // Create a FAKE trigger record (no emails)
  await prisma.alertTrigger.create({
    data: {
      alertId: alert.id,
      userId: user.id,
      metal: alert.metal,
      price: alert.threshold,
      triggered: true,
    },
  });

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
