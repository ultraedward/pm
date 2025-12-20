// FILE: pages/api/cron/check-alerts.js
import runAlertsChecker, { runAlertChecks } from "../../../lib/alertsChecker";

const useMock = process.env.USE_MOCK_DATA === "true";

export default async function handler(req, res) {
  if (useMock) {
    return res.status(200).json({ ok: true, mock: true, ran: false });
  }

  await (runAlertChecks?.() || runAlertsChecker());
  res.status(200).json({ ok: true });
}
