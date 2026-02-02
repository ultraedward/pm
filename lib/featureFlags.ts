export function isFeatureDisabled(feature: string) {
  // Global kill switch (optional)
  if (process.env.SCHEMA_STABILIZING === "true") {
    return true;
  }

  return false;
}

export function allowDevOverride(req: Request) {
  const isDev =
    process.env.NODE_ENV !== "production" ||
    req.headers.get("x-dev-override") === "true";

  return isDev;
}