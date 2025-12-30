import { exec } from "child_process";

export default function handler(req, res) {
  exec("node scripts/refreshPrices.js", (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: err.message });
    }

    res.json({ ok: true, message: "Refresh started." });
  });
}
