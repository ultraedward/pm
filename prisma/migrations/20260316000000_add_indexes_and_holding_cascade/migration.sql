-- Add indexes for frequently-queried fields

-- Alert: filter by userId and active status
CREATE INDEX IF NOT EXISTS "Alert_userId_idx" ON "Alert"("userId");
CREATE INDEX IF NOT EXISTS "Alert_active_idx" ON "Alert"("active");

-- AlertTrigger: fetch triggers by alertId
CREATE INDEX IF NOT EXISTS "AlertTrigger_alertId_idx" ON "AlertTrigger"("alertId");

-- Price: primary query pattern is metal + timestamp desc
CREATE INDEX IF NOT EXISTS "Price_metal_timestamp_idx" ON "Price"("metal", "timestamp" DESC);

-- Holding: filter by userId
CREATE INDEX IF NOT EXISTS "Holding_userId_idx" ON "Holding"("userId");

-- Fix Holding cascade (orphaned holdings if user deleted)
ALTER TABLE "Holding" DROP CONSTRAINT IF EXISTS "Holding_userId_fkey";
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
