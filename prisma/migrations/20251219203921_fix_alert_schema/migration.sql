-- 1. Add new columns as nullable
ALTER TABLE "Alert"
ADD COLUMN "email" TEXT,
ADD COLUMN "metalId" TEXT,
ADD COLUMN "target" DECIMAL(10,2),
ADD COLUMN "triggered" BOOLEAN NOT NULL DEFAULT false;

-- 2. Backfill existing rows with safe placeholders
UPDATE "Alert"
SET
  "email" = 'test@example.com',
  "metalId" = 'TEMP_METAL_ID',
  "target" = 0;

-- 3. Make columns required
ALTER TABLE "Alert"
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "metalId" SET NOT NULL,
ALTER COLUMN "target" SET NOT NULL;

-- 4. Replace direction column safely
ALTER TABLE "Alert"
DROP COLUMN "direction";

ALTER TABLE "Alert"
ADD COLUMN "direction" TEXT NOT NULL DEFAULT 'above';

-- 5. Index (foreign key added later by Prisma)
CREATE INDEX "Alert_email_idx" ON "Alert"("email");
