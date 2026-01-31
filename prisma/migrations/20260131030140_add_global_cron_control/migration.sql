/*
  Warnings:

  - You are about to drop the column `frequency` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `lastTriggeredAt` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `trailingOffset` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Alert` table. All the data in the column will be lost.
  - The primary key for the `CronControl` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `enabled` on the `CronControl` table. All the data in the column will be lost.
  - The `id` column on the `CronControl` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AlertTrigger` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailDelivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EmailLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SystemConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "frequency",
DROP COLUMN "lastTriggeredAt",
DROP COLUMN "trailingOffset",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "CronControl" DROP CONSTRAINT "CronControl_pkey",
DROP COLUMN "enabled",
ADD COLUMN     "cronEnabled" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "CronControl_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "AlertTrigger";

-- DropTable
DROP TABLE "EmailDelivery";

-- DropTable
DROP TABLE "EmailLog";

-- DropTable
DROP TABLE "SystemConfig";

-- DropEnum
DROP TYPE "AlertFrequency";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
