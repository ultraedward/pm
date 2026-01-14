-- CreateEnum
CREATE TYPE "AlertDirection" AS ENUM ('ABOVE', 'BELOW');

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "metal" TEXT NOT NULL,
    "targetPrice" DOUBLE PRECISION NOT NULL,
    "direction" "AlertDirection" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertTrigger" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlertTrigger_alertId_triggeredAt_idx" ON "AlertTrigger"("alertId", "triggeredAt");

-- AddForeignKey
ALTER TABLE "AlertTrigger" ADD CONSTRAINT "AlertTrigger_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
