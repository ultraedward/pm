// lib/alerts/engine.ts
// FULL SHEET — COPY / PASTE ENTIRE FILE

import { prisma } from "@/lib/prisma";
import { getLivePrices } from "@/lib/prices";

type Metal = "Gold" | "Silver" | "Platinum" | "Palladium";
type Direction = "ABOVE" | "BELOW";

export type AlertRunSource = "cron" | "manual" | "dev";

export type TriggeredAlert = {
  alertId: string;
  userId: string;
  metal: Metal;
  direction: Direction;
  targetPrice: number;
  currentPrice: number;
  triggeredAt: string; // ISO
  triggerId: string;
};

export type AlertRunSummary = {
  ok: true;
  source: AlertRunSource;
  ranAt: string; // ISO
  cooldownMinutes: number;
  priceMaxAgeMinutes: number;
  pricesUsed: Partial<Record<Metal, number>>;
  pricesUpdatedAt: string | null;
  alertsConsidered: number;
  eligibleAlerts: number;
  triggered: number;
  triggers: TriggeredAlert[];
  skipped: {
    dueToCooldown: number;
    dueToMissingPrice: number;
  };
};

export type AlertRunError = {
  ok: false;
  source: AlertRunSource;
  ranAt: string;
  error: string;
};

const METALS: Metal[] = ["Gold", "Silver", "Platinum", "Palladium"];

function numEnv(key: string, fallback: number) {
  const raw = process.env[key];
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

function nowIso() {
  return new Date().toISOString();
}

function isConditionMet(direction: Direction, current: number, target: number) {
  return direction === "ABOVE" ? current >= target : current <= target;
}

/**
 * Reads the latest prices from DB.
 * Returns the most recent timestamp among those rows (may be null).
 */
async function readLatestPricesFromDb(): Promise<{
  prices: Partial<Record<Metal, number>>;
  updatedAt: Date | null;
}> {
  // Grab a small batch and dedupe per metal
  const rows = await prisma.price.findMany({
    orderBy: { timestamp: "desc" },
    take: 80,
    select: { metal: true, price: true, timestamp: true },
  });

  const prices: Partial<Record<Metal, number>> = {};
  let newest: Date | null = null;

  for (const r of rows) {
    if (!newest) newest = r.timestamp;
    if (METALS.includes(r.metal as Metal) && !(r.metal as Metal in prices)) {
      prices[r.metal as Metal] = r.price;
    }
  }

  return { prices, updatedAt: newest };
}

async function ingestLivePrices(): Promise<{
  prices: Partial<Record<Metal, number>>;
  updatedAt: Date;
}> {
  const live = await getLivePrices();
  const now = new Date();

  // Persist all metals we have
  const writes = Object.entries(live).map(([metal, price]) =>
    prisma.price.create({
      data: {
        metal,
        price,
        timestamp: now,
      },
      select: { id: true },
    })
  );

  await prisma.$transaction(writes);

  return {
    prices: {
      Gold: live.Gold,
      Silver: live.Silver,
      Platinum: live.Platinum,
      Palladium: live.Palladium,
    },
    updatedAt: now,
  };
}

/**
 * Canonical alert evaluation pipeline.
 * - Reads prices (DB first)
 * - Optionally ingests live prices if DB is stale
 * - Evaluates all alerts
 * - Enforces cooldown purely in code (no schema changes)
 * - Writes triggers in a transaction
 */
export async function runAlertEngine(
  source: AlertRunSource
): Promise<AlertRunSummary | AlertRunError> {
  const ranAt = nowIso();

  const cooldownMinutes = numEnv("ALERT_COOLDOWN_MIN", 60);
  const priceMaxAgeMinutes = numEnv("ALERT_PRICE_MAX_AGE_MIN", 15);

  try {
    // 1) Fetch all alerts
    const alerts = await prisma.alert.findMany({
      select: {
        id: true,
        userId: true,
        metal: true,
        direction: true,
        targetPrice: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // 2) Get latest prices from DB
    let { prices, updatedAt } = await readLatestPricesFromDb();

    // 3) If stale or missing metals -> ingest live
    const missingAnyMetal = METALS.some((m) => prices[m] == null);
    const isStale =
      !updatedAt ||
      Date.now() - updatedAt.getTime() > priceMaxAgeMinutes * 60 * 1000;

    if (missingAnyMetal || isStale) {
      const ingested = await ingestLivePrices();
      prices = ingested.prices;
      updatedAt = ingested.updatedAt;
    }

    // 4) Preload last trigger per alert (cooldown)
    // Prisma doesn't support "distinct on" with orderBy in a single query across all DBs,
    // so we do a safe N+1 *batched* approach:
    const lastTriggers = await prisma.alertTrigger.findMany({
      where: {
        alertId: { in: alerts.map((a) => a.id) },
      },
      orderBy: { triggeredAt: "desc" },
      take: Math.min(alerts.length, 5000),
      select: { alertId: true, triggeredAt: true },
    });

    const lastByAlert = new Map<string, Date>();
    for (const t of lastTriggers) {
      if (!lastByAlert.has(t.alertId)) lastByAlert.set(t.alertId, t.triggeredAt);
    }

    // 5) Evaluate
    let eligibleAlerts = 0;
    let dueToCooldown = 0;
    let dueToMissingPrice = 0;

    const toTrigger: {
      alertId: string;
      userId: string;
      metal: Metal;
      direction: Direction;
      targetPrice: number;
      currentPrice: number;
      triggeredAt: Date;
    }[] = [];

    const now = new Date();
    for (const a of alerts) {
      const metal = a.metal as Metal;
      const direction = a.direction as Direction;
      const currentPrice = prices[metal];

      if (!currentPrice && currentPrice !== 0) {
        dueToMissingPrice++;
        continue;
      }

      // cooldown check
      const last = lastByAlert.get(a.id);
      if (last) {
        const minsSince = (Date.now() - last.getTime()) / 1000 / 60;
        if (minsSince < cooldownMinutes) {
          dueToCooldown++;
          continue;
        }
      }

      eligibleAlerts++;
      if (isConditionMet(direction, currentPrice, a.targetPrice)) {
        toTrigger.push({
          alertId: a.id,
          userId: a.userId,
          metal,
          direction,
          targetPrice: a.targetPrice,
          currentPrice,
          triggeredAt: now,
        });
      }
    }

    // 6) Persist triggers (transaction)
    const created = await prisma.$transaction(
      toTrigger.map((t) =>
        prisma.alertTrigger.create({
          data: {
            alertId: t.alertId,
            price: t.currentPrice,
            triggeredAt: t.triggeredAt,
          },
          select: {
            id: true,
            triggeredAt: true,
            price: true,
            alert: {
              select: {
                id: true,
                userId: true,
                metal: true,
                direction: true,
                targetPrice: true,
              },
            },
          },
        })
      )
    );

    const triggers: TriggeredAlert[] = created.map((row) => ({
      triggerId: row.id,
      triggeredAt: row.triggeredAt.toISOString(),
      currentPrice: row.price,
      alertId: row.alert.id,
      userId: row.alert.userId,
      metal: row.alert.metal as Metal,
      direction: row.alert.direction as Direction,
      targetPrice: row.alert.targetPrice,
    }));

    return {
      ok: true,
      source,
      ranAt,
      cooldownMinutes,
      priceMaxAgeMinutes,
      pricesUsed: prices,
      pricesUpdatedAt: updatedAt ? updatedAt.toISOString() : null,
      alertsConsidered: alerts.length,
      eligibleAlerts,
      triggered: triggers.length,
      triggers,
      skipped: {
        dueToCooldown,
        dueToMissingPrice,
      },
    };
  } catch (e: any) {
    console.error("[alerts][engine] run failed", e);
    return {
      ok: false,
      source,
      ranAt,
      error: e?.message ?? "Unknown error",
    };
  }
}
