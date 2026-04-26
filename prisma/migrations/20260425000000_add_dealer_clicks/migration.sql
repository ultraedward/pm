-- CreateTable
CREATE TABLE "DealerClick" (
    "id" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,
    "dealerId" TEXT NOT NULL,
    "userId" TEXT,
    "subId" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'compare',
    "userAgent" TEXT,
    "ipHash" TEXT,
    "referer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealerClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DealerClick_subId_key" ON "DealerClick"("subId");

-- CreateIndex
CREATE INDEX "DealerClick_coinId_dealerId_createdAt_idx" ON "DealerClick"("coinId", "dealerId", "createdAt");

-- CreateIndex
CREATE INDEX "DealerClick_dealerId_createdAt_idx" ON "DealerClick"("dealerId", "createdAt");

-- CreateIndex
CREATE INDEX "DealerClick_source_createdAt_idx" ON "DealerClick"("source", "createdAt");

-- CreateIndex
CREATE INDEX "DealerClick_userId_idx" ON "DealerClick"("userId");
