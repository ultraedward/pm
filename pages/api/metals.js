// pages/api/metals.js

const METALS = ["XAU", "XAG", "XPT", "XPD"];

export default async function handler(req, res) {
  const key = process.env.METALS_API_KEY;
  const baseUrl = process.env.METALS_API_BASE || "https://metals-api.com/api";

  if (!key) {
    console.error("METALS_API_KEY missing from environment");
    const fallback = buildFallback();
    return res.status(500).json({
      ...fallback,
      globalError: "Missing METALS_API_KEY in .env.local",
    });
  }

  try {
    const url = `${baseUrl}/latest?access_key=${key}&base=USD&symbols=${METALS.join(",")}`;

    const response = await fetch(url);
    const json = await response.json();

    const ts =
      (typeof json.timestamp === "number" && json.timestamp) ||
      Math.floor(Date.now() / 1000);

    // If Metals-API says "success: false", or no rates
    if (!response.ok || json.success === false || !json.rates) {
      console.error("Metals API /latest error:", json.error || response.statusText);
      const fallback = buildFallback(ts, true, json.error?.info || "API error");
      return res.status(200).json(fallback);
    }

    // Convert “1 USD = 0.0005 XAU” → “1 XAU = 2000 USD”
    const result = { timestamp: ts };

    METALS.forEach((sym) => {
      const rate = json.rates[sym];
      let price = 0;
      if (typeof rate === "number" && rate > 0) {
        price = 1 / rate; // USD per oz
      }
      result[sym] = {
        price,
        change: 0, // we’re not computing 24h % now; frontend handles this
        error: false,
        source: "live",
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Metals API /latest fetch failed:", err);
    const fallback = buildFallback(Math.floor(Date.now() / 1000), true, err.message);
    return res.status(200).json(fallback);
  }
}

function buildFallback(timestamp = Math.floor(Date.now() / 1000), error = true, message) {
  const obj = { timestamp, globalError: message || null };
  METALS.forEach((sym) => {
    obj[sym] = {
      price: 0,
      change: 0,
      error,
      source: "fallback",
    };
  });
  return obj;
}
