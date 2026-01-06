-- Add EmailLog table
CREATE TABLE "EmailLog" (
  "id" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,

  CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- Add SpotPriceCache.source safely with a default
ALTER TABLE "SpotPriceCache"
ADD COLUMN "source" TEXT NOT NULL DEFAULT 'manual';

-- Add foreign key
ALTER TABLE "EmailLog"
ADD CONSTRAINT "EmailLog_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
