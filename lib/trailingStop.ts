import { Alert } from "@prisma/client";

export function updateTrailingTarget(
  alert: Alert,
  currentPrice: number
): number | null {
  if (alert.frequency !== "trailing_stop") return null;
  if (!alert.trailingOffset) return null;

  if (alert.direction === "above") {
    const newTarget = currentPrice - alert.trailingOffset;
    return newTarget > alert.target ? newTarget : null;
  }

  if (alert.direction === "below") {
    const newTarget = currentPrice + alert.trailingOffset;
    return newTarget < alert.target ? newTarget : null;
  }

  return null;
}