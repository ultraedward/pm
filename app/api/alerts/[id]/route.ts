// app/api/alerts/[id]/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

type Params = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alert = await prisma.alert.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!alert) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(alert);
}

export async function DELETE(_: Request, { params }: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.alert.delete({
    where: {
      id: params.id,
    },
  });

  return NextResponse.json({ ok: true });
}
