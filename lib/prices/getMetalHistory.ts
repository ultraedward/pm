export async function getMetalHistory(metal: "gold" | "silver") {
  const apiKey = process.env.METALS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing METALS_API_KEY");
  }

  const res = await fetch(
    `https://metals-api.com/api/timeseries?access_key=${apiKey}&base=USD&symbols=${metal === "gold" ? "XAU" : "XAG"}&start_date=${getYesterday()}&end_date=${getToday()}`,
    {
      next: { revalidate: 60 }, // cache 60 seconds
    }
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error("Failed to fetch metal history");
  }

  const symbol = metal === "gold" ? "XAU" : "XAG";

  const history = Object.values(data.rates).map((rate: any) => ({
    value: 1 / rate[symbol],
  }));

  return history;
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}