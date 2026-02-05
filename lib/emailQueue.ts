/**
 * TEMP STUB
 * Email queue disabled until EmailLog schema is finalized.
 */

export type QueuedEmail = {
  alertId: string;
  to: string;
  subject: string;
  html?: string;
};

export async function queueEmail(_email: QueuedEmail) {
  return { ok: true };
}