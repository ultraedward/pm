import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

function todayUTC() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

// GET — fetch today's prediction + streak + stats for the current user
export async function GET() {
  const user = await requireUser();
  const date = todayUTC();

  const [todayPrediction, allPredictions] = await Promise.all([
    prisma.prediction.findUnique({
      where: { userId_date_metal: { userId: user.id, date, metal: "gold" } },
    }),
    prisma.prediction.findMany({
      where: { userId: user.id, metal: "gold", correct: { not: null } },
      orderBy: { date: "desc" },
    }),
  ]);

  // Calculate streak — consecutive correct from most recent
  let streak = 0;
  for (const p of allPredictions) {
    if (p.correct === true) streak++;
    else break;
  }

  const total = allPredictions.length;
  const correct = allPredictions.filter((p) => p.correct === true).length;
  const winRate = total > 0 ? Math.round((correct / total) * 100) : null;

  // Yesterday's result (so we can show it alongside today's prompt)
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const yesterdayPrediction = allPredictions.find((p) => p.date === yesterdayStr) ?? null;

  return NextResponse.json({
    today: todayPrediction,
    yesterday: yesterdayPrediction,
    streak,
    winRate,
    total,
  });
}

// POST — submit today's prediction
export async function POST(req: Request) {
  const user = await requireUser();
  const { direction } = await req.json();

  if (direction !== "up" && direction !== "down") {
    return NextResponse.json({ error: "Invalid direction" }, { status: 400 });
  }

  const date = todayUTC();

  // Get current gold spot price as the base
  const priceRow = await prisma.price.findFirst({
    where: { metal: "gold" },
    orderBy: { timestamp: "desc" },
  });

  if (!priceRow) {
    return NextResponse.json({ error: "No price data available" }, { status: 503 });
  }

  // Upsert — only one prediction per user per day
  const prediction = await prisma.prediction.upsert({
    where: { userId_date_metal: { userId: user.id, date, metal: "gold" } },
    update: { direction, basePrice: priceRow.price },
    create: {
      userId: user.id,
      metal: "gold",
      direction,
      date,
      basePrice: priceRow.price,
    },
  });

  return NextResponse.json(prediction);
}
