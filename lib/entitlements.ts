export function hasProAccess(user: {
  stripeStatus?: string | null;
}) {
  if (process.env.ALLOW_PRO_BYPASS === "true") return true;
  return user?.stripeStatus === "active" || user?.stripeStatus === "trialing";
}
