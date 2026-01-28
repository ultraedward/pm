/*
  Warnings:

  - You are about to drop the column `userId` on the `Alert` table. All the data in the column will be lost.
  - You are about to alter the column `target` on the `Alert` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `timestamp` on the `PriceHistory` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `PriceHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to drop the column `priceId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `AlertTrigger` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- DropForeignKey
ALTER TABLE "AlertTrigger" DROP CONSTRAINT "AlertTrigger_alertId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "PriceHistory_metal_timestamp_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "userId",
ALTER COLUMN "target" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PriceHistory" DROP COLUMN "timestamp",
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "priceId";

-- DropTable
DROP TABLE "AlertTrigger";

-- CreateTable
CREATE TABLE "CronLock" (
    "name" TEXT NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronLock_pkey" PRIMARY KEY ("name")
);
