-- Create EmailLog table (safe for shadow DB)
CREATE TABLE IF NOT EXISTS "EmailLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- Foreign key (safe)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'EmailLog_userId_fkey'
  ) THEN
    ALTER TABLE "EmailLog"
    ADD CONSTRAINT "EmailLog_userId_fkey"
    FOREIGN KEY ("userId")
    REFERENCES "User"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  END IF;
END $$;

------------------------------------------------------------

-- Add source column safely to SpotPriceCache
ALTER TABLE "SpotPriceCache"
ADD COLUMN IF NOT EXISTS "source" TEXT;

-- Backfill existing rows
UPDATE "SpotPriceCache"
SET "source" = 'cron'
WHERE "source" IS NULL;

-- Enforce NOT NULL after backfill
ALTER TABLE "SpotPriceCache"
ALTER COLUMN "source" SET NOT NULL;
