-- Registered users currently receive the weekly digest with no unsubscribe
-- link. Add a per-user token (lazily generated on first digest send) and an
-- opt-out flag so /api/unsubscribe can stop sending to them, same as
-- EmailSubscriber rows already support.
ALTER TABLE "User" ADD COLUMN "unsubscribeToken" TEXT;
ALTER TABLE "User" ADD COLUMN "digestOptOut" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "User_unsubscribeToken_key" ON "User"("unsubscribeToken");
