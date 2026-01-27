// lib/alertEngine.ts

export async function evaluateAlerts() {
  return {
    status: "disabled",
    reason: "Alert engine disabled in build-safe mode"
  }
}
