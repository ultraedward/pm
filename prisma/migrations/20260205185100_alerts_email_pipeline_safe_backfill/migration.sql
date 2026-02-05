/*
  Warnings:

  - You are about to drop the column `email` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `Alert` table. All the data in the column will be lost.
  - You are about to drop the column `direction` on the `AlertTrigger` table. All the data in the column will be lost.
  - You are about to drop the column `fingerprint` on the `AlertTrigger` table. All the data in the column will be lost.
  - You are about to drop the column `metal` on the `AlertTrigger` table. All the data in the column will be lost.
  - You are about to drop the column `target` on the `AlertTrigger` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `EmailLog` table. All the data in the column will be lost.
  - You are about to drop the `CronRun` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "AlertTrigger_fingerprint_key";

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "email",
DROP COLUMN "target",
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AlertTrigger" DROP COLUMN "direction",
DROP COLUMN "fingerprint",
DROP COLUMN "metal",
DROP COLUMN "target",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "EmailLog" DROP COLUMN "error",
ADD COLUMN     "lastError" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(3);

-- DropTable
DROP TABLE "CronRun";

-- CreateIndex
CREATE INDEX "AlertTrigger_triggeredAt_idx" ON "AlertTrigger"("triggeredAt");

-- CreateIndex
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");
