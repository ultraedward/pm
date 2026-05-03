/**
 * Onboarding nudge email sender.
 * Called daily from /api/update-prices — no separate cron slot needed.
 *
 * Day-3 nudge: users created 3–4 days ago with no alerts AND no holdings.
 * Day-7 nudge: users created 7–8 days ago with no alerts AND no holdings.
 *
 * The day-window approach means each user receives each nudge at most once,
 * without a separate "emails sent" tracking table.
 */

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { buildDay3Html, buildDay7Html } from "@/lib/email/nudgeEmails";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://lode.rocks";

function dayWindow(daysAgo: number): { gte: Date; lte: Date } {
  const now = Date.now();
  return {
    gte: new Date(now - (daysAgo + 1) * 24 * 60 * 60 * 1000),
    lte: new Date(now - daysAgo * 24 * 60 * 60 * 1000),
  };
}

export async function runOnboardingNudges(): Promise<{
  day3: number;
  day7: number;
  sent: number;
  errors: string[];
}> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[nudges] RESEND_API_KEY not set — skipping");
    return { day3: 0, day7: 0, sent: 0, errors: [] };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM ?? "Lode <onboarding@resend.dev>";

  // ── Fetch latest spot prices for email body ──────────────────────────
  const spotRows = await prisma.price.findMany({
    where: { metal: { in: ["gold", "silver"] } },
    orderBy: { timestamp: "desc" },
    distinct: ["metal"],
  });
  const spots = Object.fromEntries(spotRows.map((r) => [r.metal, r.price]));
  const goldPrice: number | null = spots["gold"] ?? null;
  const silverPrice: number | null = spots["silver"] ?? null;

  // ── Find eligible users in both windows in one query ─────────────────
  const day3Window = dayWindow(3);
  const day7Window = dayWindow(7);

  const eligibleUsers = await prisma.user.findMany({
    where: {
      email: { not: null },
      createdAt: {
        gte: day7Window.gte,
        lte: day3Window.lte,
      },
      alerts: { none: {} },
      holdings: { none: {} },
    },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const day3Users = eligibleUsers.filter(
    (u) => u.createdAt >= day3Window.gte && u.createdAt <= day3Window.lte
  );
  const day7Users = eligibleUsers.filter(
    (u) => u.createdAt >= day7Window.gte && u.createdAt <= day7Window.lte
  );

  let sent = 0;
  const errors: string[] = [];

  // ── Day-3 sends ───────────────────────────────────────────────────────
  for (const user of day3Users) {
    if (!user.email) continue;
    const firstName = user.name?.split(" ")[0] ?? "";
    try {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "One thing worth doing before gold moves — Lode",
        html: buildDay3Html({ firstName, goldPrice, baseUrl: BASE_URL }),
      });
      sent++;
    } catch (err) {
      console.error(`[nudges] Day-3 failed for ${user.email}:`, err);
      errors.push(user.email);
    }
  }

  // ── Day-7 sends ───────────────────────────────────────────────────────
  for (const user of day7Users) {
    if (!user.email) continue;
    const firstName = user.name?.split(" ")[0] ?? "";
    try {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Here's where spot stands — Lode",
        html: buildDay7Html({ firstName, goldPrice, silverPrice, baseUrl: BASE_URL }),
      });
      sent++;
    } catch (err) {
      console.error(`[nudges] Day-7 failed for ${user.email}:`, err);
      errors.push(user.email);
    }
  }

  return { day3: day3Users.length, day7: day7Users.length, sent, errors };
}
