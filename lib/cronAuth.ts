import { NextRequest } from "next/server";

export function requireCronAuth(req: NextRequest): boolean {
  const secret = req.headers.get("x-cron-secret");
  return secret === process.env.CRON_SECRET;
}