/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `AlertTrigger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AlertTrigger" DROP CONSTRAINT "AlertTrigger_alertId_fkey";

-- DropForeignKey
ALTER TABLE "AlertTrigger" DROP CONSTRAINT "AlertTrigger_userId_fkey";

-- DropForeignKey
ALTER TABLE "EmailLog" DROP CONSTRAINT "EmailLog_userId_fkey";

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "stripeStatus";

-- DropTable
DROP TABLE "AlertTrigger";

-- DropTable
DROP TABLE "EmailLog";

-- CreateTable
CREATE TABLE "SpotPrice" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpotPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpotPrice_metal_createdAt_idx" ON "SpotPrice"("metal", "createdAt");
