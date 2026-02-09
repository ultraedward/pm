// lib/cronAuth.ts
import { NextRequest } from "next/server";

export function requireCronAuth(req: Request | NextRequest): boolean {
  const headerSecret =
    req.headers.get("x-cron-secret") ??
    req.headers.get("X-Cron-Secret");

  const authHeader = req.headers.get("authorization");
  const bearerSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const secret = headerSecret ?? bearerSecret;

  return Boolean(
    secret &&
    process.env.CRON_SECRET &&
    secret === process.env.CRON_SECRET
  );
}