/*
  Warnings:

  - The primary key for the `SpotPriceCache` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[metal]` on the table `SpotPriceCache` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `SpotPriceCache` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "armed" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SpotPriceCache" DROP CONSTRAINT "SpotPriceCache_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "SpotPriceCache_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpotPriceCache_metal_key" ON "SpotPriceCache"("metal");
