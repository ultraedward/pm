import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { isValidEmail } from "@/lib/validators";

export async function POST() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = user.email ?? null;

  if (!email || !isValidEmail(email)) {
    await prisma.emailLog.create({
      data: {
        userId: user.id,
        status: "invalid_email",
      },
    });

    return NextResponse.json(
      { error: "Invalid or missing email" },
      { status: 400 }
    );
  }

  const alerts = await prisma.alert.findMany({
    where: {
      userId: user.id,
    },
  });

  if (alerts.length === 0) {
    return NextResponse.json({ success: true });
  }

  await sendEmail({
    to: email,
    subject: "Precious Metals Alert",
    text: "One or more of your alerts has triggered.",
  });

  await prisma.emailLog.create({
    data: {
      userId: user.id,
      status: "sent",
    },
  });

  return NextResponse.json({ success: true });
}
