/**
 * TEMP STUB
 * Cron control table does not exist.
 * Always allow cron jobs to run.
 */

export async function isCronEnabled(): Promise<boolean> {
  return true;
}