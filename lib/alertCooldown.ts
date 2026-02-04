import { Alert, AlertTrigger } from "@prisma/client";

const COOLDOWN_MINUTES = 60;

export function isInCooldown(
  alert: Alert,
  lastTrigger?: AlertTrigger | null
): boolean {
  if (!lastTrigger) return false;

  const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;
  const elapsed = Date.now() - new Date(lastTrigger.triggeredAt).getTime();

  return elapsed < cooldownMs;
}