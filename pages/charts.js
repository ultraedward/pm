// pages/charts.js
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function formatMoney(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return `$${x.toFixed(2)}`;
}

function safeDateLabel(x) {
  if (!x) return "";
  const d = new Date(x);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ChartsPage() {
  const [metal, setMetal] = useState("XAU");
  const [take, setTake] = useState(120);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/spot-history?metal=${encodeURIComponent(metal)}&take=${take}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : [];
      // Normalize expected fields: { ts, price } OR { createdAt, price }
      const normalized = rows
        .map((r) => {
          const ts = r?.ts ?? r?.time ?? r?.createdAt ?? r?.date ?? null;
          const price = r?.price ?? r?.spot ?? r?.value ?? null;
          return { ts, price: Number(price) };
        })
        .filter((r) => r.ts && Number.isFinite(r.price))
        .map((r) => ({ ...r, label: safeDateLabel(r.ts) }));
      setSeries(normalized);
    } catch {
      setSeries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [metal, take]);

  const latest = useMemo(() => {
    if (!series.length) return null;
    return series[series.length - 1]?.price ?? null;
  }, [series]);

  return (
    <div className="page">
      <section className="section sectionTight">
        <div className="shell">
          <div className="pageHeader">
            <div>
              <div className="eyebrow">Charts</div>
              <h1 className="pageTitle">Spot history</h1>
              <p className="pageSub">
                Visual context for price moves. Use this to sanity-check before acting or setting
                targets.
              </p>
            </div>

            <div className="pageHeaderRight">
              <Link href="/alerts/create" className="btn btnPrimaryLink">
                Create Alert
              </Link>
              <Link href="/alerts" className="btn btnGhostLink">
                View Alerts
              </Link>
            </div>
          </div>

          <div className="toolbar" aria-label="Chart controls">
            <div className="toolbarGroup">
              <label className="label" htmlFor="metal">
                Metal
              </label>
              <select
                id="metal"
                className="input"
                value={metal}
                onChange={(e) => setMetal(e.target.value)}
              >
                <option value="XAU">Gold (XAU)</option>
                <option value="XAG">Silver (XAG)</option>
                <option value="XPT">Platinum (XPT)</option>
                <option value="XPD">Palladium (XPD)</option>
              </select>
            </div>

            <div className="toolbarGroup">
              <label className="label" htmlFor="take">
                Points
              </label>
              <select
                id="take"
                className="input"
                value={take}
                onChange={(e) => setTake(Number(e.target.value))}
              >
                <option value={60}>60</option>
                <option value={120}>120</option>
                <option value={240}>240</option>
              </select>
            </div>

            <div className="toolbarGroup">
              <div className="label">Latest</div>
              <div className="pill" aria-label="Latest spot price">
                {latest == null ? "—" : formatMoney(latest)}
              </div>
            </div>
          </div>

          <div className="card chartCard" aria-label="Spot price chart">
            <div className="chartHeader">
              <div>
                <div className="chartTitle">{metal} history</div>
                <div className="chartSub">
                  {loading ? "Loading…" : series.length ? "Most recent points" : "No data"}
                </div>
              </div>
              <div className="chartRight">
                <Link className="textLink" href="/">
                  Back to prices →
                </Link>
              </div>
            </div>

            <div className="chartWrap">
              {loading ? (
                <div className="skeletonChart" aria-label="Loading chart" />
              ) : series.length === 0 ? (
                <div className="emptyCompact">
                  <p className="emptyCompactText">No chart data available.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={series} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" tickMargin={8} />
                    <YAxis tickMargin={8} width={70} />
                    <Tooltip
                      formatter={(value) => formatMoney(value)}
                      labelFormatter={(label) => label}
                    />
                    <Line type="monotone" dataKey="price" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="chartNote">
              Want alerts? Set a target and we’ll tell you when {metal} crosses it.
              <Link className="inlineLink" href="/alerts/create">
                {" "}
                Create an alert
              </Link>
              .
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
