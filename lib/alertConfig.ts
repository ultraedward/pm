export const ALERT_COOLDOWN_MS = 1000 * 60 * 60 * 24; // 24 hours

export function buildTriggerFingerprint(
  alertId: string,
  price: number
) {
  // round to cents to avoid micro-flapping
  const rounded = Math.round(price * 100) / 100;
  return `${alertId}:${rounded}`;
}