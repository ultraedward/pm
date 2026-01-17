/*
  Warnings:

  - You are about to drop the column `active` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `targetPrice` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the `AlertSystemStatus` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `threshold` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AlertTrigger" DROP CONSTRAINT "AlertTrigger_alertId_fkey";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "active",
DROP COLUMN "targetPrice",
DROP COLUMN "updatedAt",
ADD COLUMN     "threshold" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AlertTrigger" ADD COLUMN     "triggeredAt" TIMESTAMP(3),
ALTER COLUMN "price" DROP NOT NULL;

-- DropTable
DROP TABLE "AlertSystemStatus";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "PriceHistory_metal_timestamp_idx" ON "PriceHistory"("metal", "timestamp");

-- CreateIndex
CREATE INDEX "AlertTrigger_alertId_idx" ON "AlertTrigger"("alertId");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertTrigger" ADD CONSTRAINT "AlertTrigger_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
