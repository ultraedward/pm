import { runAlertChecks } from "../../../lib/alertsChecker";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const provided = req.headers["x-cron-secret"];
    if (provided !== cronSecret) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  try {
    const result = await runAlertChecks();
    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("check-alerts error:", err);
    return res.status(500).json({ ok: false, error: "Check failed" });
  }
}
