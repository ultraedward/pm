export const dynamic = "force-dynamic";

import { runCronJob } from "@/lib/cron/runCron";

export async function GET() {
  await runCronJob();
  return Response.json({ ok: true });
}