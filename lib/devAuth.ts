export function requireDevAuth(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth || !auth.startsWith("Bearer ")) {
    return false;
  }

  const token = auth.replace("Bearer ", "").trim();
  return token === process.env.DEV_SECRET;
}