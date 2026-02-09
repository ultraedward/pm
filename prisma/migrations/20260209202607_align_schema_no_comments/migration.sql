-- Add updatedAt with a temporary default so existing rows are valid
ALTER TABLE "User"
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- Remove the default so Prisma controls it via @updatedAt
ALTER TABLE "User"
ALTER COLUMN "updatedAt" DROP DEFAULT;