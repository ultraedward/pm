/*
  Warnings:

  - You are about to drop the column `armed` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `metal` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `targetPrice` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the `SpotPriceCache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MetalType" AS ENUM ('GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM');

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropIndex
DROP INDEX "Alert_metal_idx";

-- DropIndex
DROP INDEX "Alert_userId_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "armed",
DROP COLUMN "metal",
DROP COLUMN "status",
DROP COLUMN "targetPrice",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ALTER COLUMN "direction" DROP DEFAULT;

-- DropTable
DROP TABLE "SpotPriceCache";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "AlertDirection";

-- DropEnum
DROP TYPE "AlertStatus";

-- DropEnum
DROP TYPE "Metal";

-- CreateTable
CREATE TABLE "Metal" (
    "id" TEXT NOT NULL,
    "type" "MetalType" NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Metal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "metalId" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metal_symbol_key" ON "Metal"("symbol");

-- CreateIndex
CREATE INDEX "Price_metalId_createdAt_idx" ON "Price"("metalId", "createdAt");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_metalId_fkey" FOREIGN KEY ("metalId") REFERENCES "Metal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_metalId_fkey" FOREIGN KEY ("metalId") REFERENCES "Metal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
