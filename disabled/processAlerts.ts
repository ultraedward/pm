// lib/processAlerts.ts

export async function processAlerts() {
  return {
    status: "disabled",
    reason: "Alert processing disabled (Resend + Prisma not configured)"
  }
}
