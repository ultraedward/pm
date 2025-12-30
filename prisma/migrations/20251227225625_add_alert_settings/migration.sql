-- CreateTable
CREATE TABLE "AlertSettings" (
    "id" TEXT NOT NULL,
    "goldThreshold" DOUBLE PRECISION NOT NULL,
    "silverThreshold" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertSettings_pkey" PRIMARY KEY ("id")
);
