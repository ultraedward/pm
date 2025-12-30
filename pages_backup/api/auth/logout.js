import { clearSession } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await clearSession(req, res);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ error: "Logout failed" });
  }
}
