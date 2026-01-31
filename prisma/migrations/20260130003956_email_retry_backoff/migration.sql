-- AlterTable
ALTER TABLE "EmailLog" ADD COLUMN     "attempt" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastAttempt" TIMESTAMP(3);
