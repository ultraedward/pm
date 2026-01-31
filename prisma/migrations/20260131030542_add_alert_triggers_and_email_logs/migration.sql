-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "AlertTrigger" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "direction" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fingerprint" TEXT NOT NULL,

    CONSTRAINT "AlertTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'resend',
    "providerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlertTrigger_fingerprint_key" ON "AlertTrigger"("fingerprint");

-- AddForeignKey
ALTER TABLE "AlertTrigger" ADD CONSTRAINT "AlertTrigger_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE CASCADE ON UPDATE CASCADE;
