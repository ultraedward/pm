import { Alert } from "@prisma/client";

export function canTriggerAlert(alert: Alert, now = new Date()): boolean {
  if (!alert.lastTriggeredAt) return true;

  const last = alert.lastTriggeredAt.getTime();
  const current = now.getTime();

  switch (alert.frequency) {
    case "once":
      return false;

    case "once_per_day": {
      const lastDay = new Date(last).toDateString();
      const today = new Date(current).toDateString();
      return lastDay !== today;
    }

    case "once_per_hour": {
      const diffMs = current - last;
      return diffMs >= 60 * 60 * 1000;
    }

    case "trailing_stop":
      return true;

    default:
      return true;
  }
}