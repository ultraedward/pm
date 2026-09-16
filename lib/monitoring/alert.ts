import { prisma } from "@/lib/prisma";
import { queueEmail } from "@/lib/emailQueue";

const DEFAULT_ALERT_EMAIL = "hello@lode.rocks";
const MIN_HOURS_BETWEEN_SENDS = 6;

/**
 * Sends an internal ops alert email, but at most once per `key` every
 * MIN_HOURS_BETWEEN_SENDS hours — so a sustained problem (e.g. goldprice.org
 * down for a whole day, or every cron run hitting the hardcoded fallback)
 * sends one email, not one per cron run.
 *
 * Best-effort and never throws: a broken alert pipe should never break the
 * price update it's monitoring. Set ALERT_EMAIL in the environment to route
 * these somewhere other than hello@lode.rocks.
 */
export async function sendOpsAlert(key: string, subject: string, detail: string) {
  try {
    const existing = await prisma.systemAlert.findUnique({ where: { key } });
    const now = new Date();

    if (existing) {
      const hoursSinceLast =
        (now.getTime() - existing.lastSentAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLast < MIN_HOURS_BETWEEN_SENDS) {
        return { sent: false, reason: "rate-limited" as const };
      }
    }

    const to = process.env.ALERT_EMAIL || DEFAULT_ALERT_EMAIL;

    await queueEmail({
      alertId: `system-${key}`,
      to,
      subject,
      html: `<p>${detail}</p><p style="color:#888;font-size:12px">Sent ${now.toISOString()}. Alert key "${key}" is rate-limited to at most one email every ${MIN_HOURS_BETWEEN_SENDS}h while the condition persists.</p>`,
    });

    await prisma.systemAlert.upsert({
      where: { key },
      create: { key, lastSentAt: now, detail },
      update: { lastSentAt: now, detail },
    });

    return { sent: true as const };
  } catch (err) {
    console.error(`[ops-alert] failed to send/record alert for key=${key}:`, err);
    return { sent: false, reason: "error" as const };
  }
}
