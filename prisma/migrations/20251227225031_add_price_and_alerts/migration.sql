/*
  Warnings:

  - You are about to drop the `Alert` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Metal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpotPriceCache` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_metalId_fkey";

-- DropTable
DROP TABLE "Alert";

-- DropTable
DROP TABLE "Metal";

-- DropTable
DROP TABLE "Price";

-- DropTable
DROP TABLE "SpotPriceCache";

-- CreateTable
CREATE TABLE "PricePoint" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricePoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertEvent" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PricePoint_metal_createdAt_idx" ON "PricePoint"("metal", "createdAt");

-- CreateIndex
CREATE INDEX "AlertEvent_metal_triggeredAt_idx" ON "AlertEvent"("metal", "triggeredAt");
