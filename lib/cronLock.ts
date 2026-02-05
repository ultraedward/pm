/**
 * TEMP STUB
 * cronLock table does not exist.
 * No-op locking for cron jobs.
 */

export async function acquireCronLock(_name: string): Promise<boolean> {
  return true;
}

export async function releaseCronLock(_name: string): Promise<void> {
  return;
}