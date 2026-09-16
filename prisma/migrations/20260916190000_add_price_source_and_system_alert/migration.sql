-- Track which upstream a Price row actually came from (goldprice-spot,
-- yahoo-futures, fallback) so a silent fallback to the pre-fix futures path
-- is a queryable fact, not something we find out from a Reddit comment again.
ALTER TABLE "Price" ADD COLUMN "source" TEXT;

-- De-dupe table for ops alert emails: one row per alert key, updated on send,
-- so a sustained problem sends one email (rate-limited), not one per cron run.
CREATE TABLE "SystemAlert" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "lastSentAt" TIMESTAMP(3) NOT NULL,
    "detail" TEXT,

    CONSTRAINT "SystemAlert_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SystemAlert_key_key" ON "SystemAlert"("key");
