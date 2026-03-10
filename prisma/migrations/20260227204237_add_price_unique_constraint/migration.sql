/*
  Warnings:

  - You are about to drop the column `costBasis` on the `Holding` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `Price` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[metal,timestamp]` on the table `Price` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `purchaseDate` to the `Holding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchasePrice` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_userId_fkey";

-- AlterTable
ALTER TABLE "Holding" DROP COLUMN "costBasis",
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "source",
ALTER COLUMN "timestamp" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Price_metal_timestamp_key" ON "Price"("metal", "timestamp");

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
