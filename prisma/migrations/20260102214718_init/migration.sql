/*
  Warnings:

  - You are about to drop the column `condition` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `notified` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `triggeredAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `trendBias` on the `Metal` table. All the data in the column will be lost.
  - You are about to drop the column `volatility` on the `Metal` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CronStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `direction` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Metal_symbol_key";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "condition",
DROP COLUMN "notified",
DROP COLUMN "triggeredAt",
ADD COLUMN     "direction" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Metal" DROP COLUMN "trendBias",
DROP COLUMN "volatility";

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "createdAt",
DROP COLUMN "price",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeStatus" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "CronStatus";

-- DropEnum
DROP TYPE "AlertCondition";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "SpotPriceCache" (
    "id" TEXT NOT NULL,
    "metalId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpotPriceCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpotPriceCache_metalId_key" ON "SpotPriceCache"("metalId");

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_metalId_idx" ON "Alert"("metalId");

-- CreateIndex
CREATE INDEX "Price_metalId_timestamp_idx" ON "Price"("metalId", "timestamp");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotPriceCache" ADD CONSTRAINT "SpotPriceCache_metalId_fkey" FOREIGN KEY ("metalId") REFERENCES "Metal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
