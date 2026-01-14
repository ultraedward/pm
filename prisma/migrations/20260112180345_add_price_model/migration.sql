/*
  Warnings:

  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlertTrigger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CronRun` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpotPriceCache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- DropForeignKey
ALTER TABLE "AlertTrigger" DROP CONSTRAINT "AlertTrigger_alertId_fkey";

-- DropTable
DROP TABLE "Alert";

-- DropTable
DROP TABLE "AlertTrigger";

-- DropTable
DROP TABLE "CronRun";

-- DropTable
DROP TABLE "SpotPriceCache";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Price_metal_timestamp_idx" ON "Price"("metal", "timestamp");
