-- =========================================
-- ALERT TABLE
-- =========================================

-- 1) Add columns as nullable first
ALTER TABLE "Alert"
ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ;

-- 2) Backfill existing rows
UPDATE "Alert"
SET
  "price" = 0,
  "updatedAt" = NOW()
WHERE "price" IS NULL
   OR "updatedAt" IS NULL;

-- 3) Enforce NOT NULL + defaults
ALTER TABLE "Alert"
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT NOW();


-- =========================================
-- EMAIL LOG TABLE
-- =========================================

-- 4) Add columns as nullable first
ALTER TABLE "EmailLog"
ADD COLUMN IF NOT EXISTS "html" TEXT,
ADD COLUMN IF NOT EXISTS "userId" TEXT,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMPTZ;

-- 5) Backfill existing rows
UPDATE "EmailLog"
SET
  "html" = '',
  "userId" = (
    SELECT "userId"
    FROM "Alert"
    WHERE "Alert"."id" = "EmailLog"."alertId"
    LIMIT 1
  ),
  "updatedAt" = NOW()
WHERE "html" IS NULL
   OR "userId" IS NULL
   OR "updatedAt" IS NULL;

-- 6) Enforce NOT NULL + defaults
ALTER TABLE "EmailLog"
ALTER COLUMN "html" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT NOW();


-- =========================================
-- INDEXES
-- =========================================

CREATE INDEX IF NOT EXISTS "Alert_userId_idx" ON "Alert"("userId");
CREATE INDEX IF NOT EXISTS "EmailLog_userId_idx" ON "EmailLog"("userId");
CREATE INDEX IF NOT EXISTS "EmailLog_alertId_idx" ON "EmailLog"("alertId");