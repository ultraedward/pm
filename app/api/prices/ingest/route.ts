import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { metal, price } = await req.json();

    if (!metal || typeof price !== "number") {
      return NextResponse.json(
        { ok: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const [record] = await prisma.$queryRaw<
      {
        id: string;
        metal: string;
        price: number;
        createdAt: Date;
      }[]
    >`
      INSERT INTO "SpotPrice"
        (metal, price, "createdAt")
      VALUES
        (${metal}, ${price}, NOW())
      RETURNING id, metal, price, "createdAt"
    `;

    return NextResponse.json({
      ok: true,
      record,
    });
  } catch (err) {
    console.error("INGEST ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to ingest price" },
      { status: 500 }
    );
  }
}
