/*
  Warnings:

  - A unique constraint covering the columns `[userId,metal,direction,targetPrice]` on the table `Alert` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `metal` on the `Alert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Metal" AS ENUM ('gold', 'silver', 'platinum');

-- CreateEnum
CREATE TYPE "AlertDirection" AS ENUM ('above', 'below');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('active', 'paused');

-- AlterTable
ALTER TABLE "Alert"
ADD COLUMN "direction" "AlertDirection" NOT NULL DEFAULT 'above',
ADD COLUMN "status" "AlertStatus" NOT NULL DEFAULT 'active',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();


-- CreateTable
CREATE TABLE "SpotPriceCache" (
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpotPriceCache_pkey" PRIMARY KEY ("metal")
);

-- CreateIndex
CREATE INDEX "Alert_metal_idx" ON "Alert"("metal");

-- CreateIndex
CREATE UNIQUE INDEX "Alert_userId_metal_direction_targetPrice_key" ON "Alert"("userId", "metal", "direction", "targetPrice");
