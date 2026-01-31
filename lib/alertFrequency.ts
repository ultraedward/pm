import { AlertTrigger } from "@prisma/client";

type Frequency =
  | "once"
  | "once_per_hour"
  | "once_per_day";

export function canTriggerAlert(
  frequency: Frequency,
  lastTrigger: AlertTrigger | null,
  now: Date = new Date()
): boolean {
  if (!lastTrigger) return true;

  const last = lastTrigger.triggeredAt.getTime();
  const current = now.getTime();

  switch (frequency) {
    case "once":
      return false;

    case "once_per_hour":
      return current - last >= 60 * 60 * 1000;

    case "once_per_day":
      return current - last >= 24 * 60 * 60 * 1000;

    default:
      return true;
  }
}