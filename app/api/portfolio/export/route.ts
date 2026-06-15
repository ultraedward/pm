import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasProAccess } from "@/lib/entitlements";
import { fetchAllSpotPrices } from "@/lib/prices/fetchSpotPrices";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, subscriptionStatus: true, proUntil: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isPro = hasProAccess({
    stripeStatus: user.subscriptionStatus,
    proUntil: user.proUntil,
  });

  if (!isPro) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const [holdings, spots] = await Promise.all([
    prisma.holding.findMany({
      where: { userId: user.id },
      orderBy: [{ metal: "asc" }, { purchaseDate: "asc" }],
    }),
    fetchAllSpotPrices(),
  ]);

  // Build CSV rows
  const rows: string[] = [
    "Metal,Purchase Date,Ounces,Purchase Price ($/oz),Cost Basis ($),Spot Price ($/oz),Current Value ($),Gain/Loss ($),Gain/Loss (%)",
  ];

  for (const h of holdings) {
    const ounces        = Number(h.ounces);
    const purchasePrice = Number(h.purchasePrice);
    const spotRaw       = spots[h.metal as keyof typeof spots];
    const spot: number  = (typeof spotRaw === "number" ? spotRaw : null) ?? purchasePrice;
    const costBasis     = ounces * purchasePrice;
    const currentValue  = ounces * spot;
    const gainLoss      = currentValue - costBasis;
    const gainPct       = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

    rows.push([
      h.metal.charAt(0).toUpperCase() + h.metal.slice(1),
      new Date(h.purchaseDate).toISOString().split("T")[0],
      ounces.toFixed(4),
      purchasePrice.toFixed(2),
      costBasis.toFixed(2),
      spot.toFixed(2),
      currentValue.toFixed(2),
      gainLoss.toFixed(2),
      gainPct.toFixed(2) + "%",
    ].join(","));
  }

  const csv = rows.join("\n");
  const date = new Date().toISOString().split("T")[0];
  const filename = `lode-portfolio-${date}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
