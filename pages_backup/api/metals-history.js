export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: "Missing symbol" });
  }

  try {
    const apiKey = process.env.METALS_API_KEY;

    const url = `https://metals-api.com/api/timeseries?access_key=${apiKey}&start_date=2024-01-01&end_date=2024-12-31&base=${symbol}&symbols=USD`;

    const response = await fetch(url);
    const json = await response.json();

    if (!json.success || !json.rates) {
      throw new Error("Unexpected Metals API response");
    }

    const history = Object.entries(json.rates).map(([date, priceObj]) => ({
      timestamp: Date.parse(date) / 1000,
      price: priceObj.USD
    }));

    res.status(200).json({ history });
  } catch (err) {
    console.error("History API error:", err);
    res.status(500).json({ error: "Failed to load history" });
  }
}
