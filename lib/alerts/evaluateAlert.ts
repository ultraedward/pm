type AlertDirection = "above" | "below"

export function evaluateAlert(
  alertPrice: number,
  currentPrice: number,
  direction: AlertDirection
): boolean {
  if (direction === "above") {
    return currentPrice >= alertPrice
  }
  return currentPrice <= alertPrice
}