-- CreateTable
CREATE TABLE "CronStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastRun" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CronStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronStatus_name_key" ON "CronStatus"("name");
