/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeStatus` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailLog" DROP CONSTRAINT "EmailLog_userId_fkey";

-- DropIndex
DROP INDEX "SpotPriceCache_metal_createdAt_idx";

-- AlterTable
ALTER TABLE "AlertTrigger" ALTER COLUMN "triggered" SET DEFAULT true;

-- AlterTable
ALTER TABLE "SpotPriceCache" ALTER COLUMN "source" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "stripeStatus";

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
