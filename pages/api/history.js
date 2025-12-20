// FILE: pages/api/history.js
import { getPriceHistory } from "../../lib/dataSource";

export default async function handler(req, res) {
  const data = await getPriceHistory();
  res.status(200).json({ data });
}
