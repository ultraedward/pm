import { Alert } from "@prisma/client";

/**
 * Computes a trailing stop target price.
 * This is a NO-OP unless trailing stop fields exist on Alert.
 *
 * Safe-by-default: will return null if trailing stop
 * is not yet implemented in schema.
 */
export function computeTrailingStopTarget(
  alert: Alert,
  currentPrice: number
): number | null {
  // Trailing stop not yet enabled at schema level
  // Prevents build-time breakage
  return null;
}