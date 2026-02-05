/**
 * TEMP STUB
 * EmailLog schema no longer supports direct alertId writes.
 * Real email queuing will be reintroduced later.
 */

export async function sendAlertEmail(_args: {
  alertId: string;
  to: string;
  subject: string;
  html: string;
}) {
  return {
    skipped: true,
    reason: "email pipeline temporarily disabled",
  };
}