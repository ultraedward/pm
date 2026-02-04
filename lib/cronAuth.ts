import { NextRequest } from "next/server";

export function requireCronAuth(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (!auth) return false;

  const token = auth.replace("Bearer ", "");
  return token === process.env.CRON_SECRET;
}