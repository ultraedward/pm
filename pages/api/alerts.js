// FILE: pages/api/alerts.js
import { getAlerts } from "../../lib/dataSource";

export default async function handler(req, res) {
  const alerts = await getAlerts();
  res.status(200).json({ alerts });
}
