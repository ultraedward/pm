/*
  Warnings:

  - You are about to drop the `AlertEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AlertSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PricePoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "AlertEvent";

-- DropTable
DROP TABLE "AlertSettings";

-- DropTable
DROP TABLE "PricePoint";

-- CreateTable
CREATE TABLE "Metal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "volatility" DOUBLE PRECISION NOT NULL,
    "trendBias" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Metal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "metalId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metal_symbol_key" ON "Metal"("symbol");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_metalId_fkey" FOREIGN KEY ("metalId") REFERENCES "Metal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
