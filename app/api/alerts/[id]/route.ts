// app/api/alerts/[id]/route.ts
// FULL FILE — COPY / PASTE

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * DELETE an alert by ID
 * Server-auth protected (admin access)
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.alert.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[alerts/delete]", err);
    return NextResponse.json(
      { error: "Alert not found" },
      { status: 404 }
    );
  }
}
