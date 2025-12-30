// FILE: pages/api/cron/auto-move-prices.js
const useMock = process.env.USE_MOCK_DATA === "true";

export default async function handler(req, res) {
  if (useMock) {
    return res.status(200).json({ ok: true, mock: true, moved: false });
  }

  // Real price move logic (prod) would live here.
  res.status(200).json({ ok: true });
}
