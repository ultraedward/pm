-- CreateTable
CREATE TABLE "CronControl" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronControl_pkey" PRIMARY KEY ("id")
);
