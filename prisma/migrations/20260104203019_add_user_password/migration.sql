/*
  Warnings:

  - You are about to drop the column `metalId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `targetPrice` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `triggered` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Metal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpotPriceCache` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `metal` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `threshold` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_metalId_fkey";

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_metalId_fkey";

-- DropForeignKey
ALTER TABLE "SpotPriceCache" DROP CONSTRAINT "SpotPriceCache_metalId_fkey";

-- DropIndex
DROP INDEX "Alert_metalId_idx";

-- DropIndex
DROP INDEX "Alert_userId_idx";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "metalId",
DROP COLUMN "targetPrice",
DROP COLUMN "triggered",
ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "metal" TEXT NOT NULL,
ADD COLUMN     "threshold" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "password" TEXT,
ALTER COLUMN "email" SET NOT NULL;

-- DropTable
DROP TABLE "Metal";

-- DropTable
DROP TABLE "Price";

-- DropTable
DROP TABLE "SpotPriceCache";

-- CreateTable
CREATE TABLE "AlertTrigger" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "triggered" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertTrigger" ADD CONSTRAINT "AlertTrigger_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
