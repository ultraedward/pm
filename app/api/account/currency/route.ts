import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SUPPORTED_CURRENCIES } from "@/lib/fx";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { currency } = body;

  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    return NextResponse.json(
      { error: `Unsupported currency. Choose from: ${SUPPORTED_CURRENCIES.join(", ")}` },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { preferredCurrency: currency },
  });

  return NextResponse.json({ ok: true, currency });
}
