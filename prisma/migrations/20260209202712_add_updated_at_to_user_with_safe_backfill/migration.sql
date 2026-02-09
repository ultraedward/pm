/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_userId_fkey";

-- AlterTable
ALTER TABLE "AlertTrigger" ADD COLUMN     "deliveredAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailVerified";

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_metal_active_idx" ON "Alert"("metal", "active");

-- CreateIndex
CREATE INDEX "AlertTrigger_alertId_idx" ON "AlertTrigger"("alertId");

-- CreateIndex
CREATE INDEX "EmailLog_status_nextAttemptAt_idx" ON "EmailLog"("status", "nextAttemptAt");

-- CreateIndex
CREATE INDEX "EmailLog_alertId_idx" ON "EmailLog"("alertId");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
