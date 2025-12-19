/*
  Warnings:

  - You are about to drop the column `metalId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Metal` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Metal` table. All the data in the column will be lost.
  - Added the required column `metal` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_metalId_fkey";

-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_metalId_fkey";

-- DropIndex
DROP INDEX "Alert_email_idx";

-- DropIndex
DROP INDEX "Price_metalId_createdAt_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "metalId",
ADD COLUMN     "metal" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Metal" DROP COLUMN "type",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "MetalType";

-- CreateTable
CREATE TABLE "SpotPriceCache" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpotPriceCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpotPriceCache_metal_key" ON "SpotPriceCache"("metal");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_metalId_fkey" FOREIGN KEY ("metalId") REFERENCES "Metal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
