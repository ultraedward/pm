/*
  Warnings:

  - You are about to drop the column `active` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SpotPrice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `target` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "active",
DROP COLUMN "threshold",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "target" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "SpotPrice";

-- CreateTable
CREATE TABLE "AlertTrigger" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotPriceCache" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpotPriceCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);
