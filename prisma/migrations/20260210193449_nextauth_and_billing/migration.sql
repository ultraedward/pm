/*
  Warnings:

  - You are about to drop the column `deliveredAt` on the `AlertTrigger` table. All the data in the column will be lost.
  - You are about to drop the column `stripePriceId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CronRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EmailLog" DROP CONSTRAINT "EmailLog_alertId_fkey";

-- DropIndex
DROP INDEX "Alert_metal_active_idx";

-- DropIndex
DROP INDEX "Alert_userId_idx";

-- DropIndex
DROP INDEX "AlertTrigger_alertId_idx";

-- DropIndex
DROP INDEX "Price_metal_timestamp_idx";

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "lastTriggeredAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AlertTrigger" DROP COLUMN "deliveredAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripePriceId",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "stripeCurrentPeriodEnd" TIMESTAMP(3);

-- DropTable
DROP TABLE "CronRun";

-- DropTable
DROP TABLE "EmailLog";
