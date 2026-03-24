export function hasProAccess(user: {
  stripeStatus?: string | null;
  proUntil?: Date | null;
}) {
  if (process.env.NODE_ENV !== "production" && process.env.ALLOW_PRO_BYPASS === "true") return true;
  if (user?.proUntil && user.proUntil > new Date()) return true;
  return user?.stripeStatus === "active" || user?.stripeStatus === "trialing";
}
