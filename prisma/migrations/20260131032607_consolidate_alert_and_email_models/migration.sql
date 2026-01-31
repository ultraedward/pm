/*
  Warnings:

  - You are about to drop the column `error` on the `EmailLog` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `alertId` to the `EmailLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EmailLog" DROP COLUMN "error",
ADD COLUMN     "alertId" TEXT NOT NULL,
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "sentAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Alert_userId_idx" ON "Alert"("userId");

-- CreateIndex
CREATE INDEX "Alert_metal_idx" ON "Alert"("metal");

-- CreateIndex
CREATE INDEX "AlertTrigger_alertId_idx" ON "AlertTrigger"("alertId");

-- CreateIndex
CREATE INDEX "EmailLog_alertId_idx" ON "EmailLog"("alertId");

-- CreateIndex
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");

-- CreateIndex
CREATE INDEX "PriceHistory_metal_createdAt_idx" ON "PriceHistory"("metal", "createdAt");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
