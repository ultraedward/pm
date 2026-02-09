export type AlertDirection = "above" | "below";

export function evaluateAlert(
  targetPrice: number,
  currentPrice: number,
  direction: AlertDirection
): boolean {
  if (direction === "above") {
    return currentPrice >= targetPrice;
  }

  if (direction === "below") {
    return currentPrice <= targetPrice;
  }

  return false;
}