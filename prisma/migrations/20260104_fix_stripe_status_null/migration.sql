-- Fix existing NULL stripeStatus values
UPDATE "User"
SET "stripeStatus" = 'free'
WHERE "stripeStatus" IS NULL;

-- Ensure column allows NULLs (safety)
ALTER TABLE "User"
ALTER COLUMN "stripeStatus" DROP NOT NULL;
