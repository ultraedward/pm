// pages/index.js
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatMoney(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return `$${x.toFixed(2)}`;
}

export default function PricesPage() {
  const [prices, setPrices] = useState([]);
  const [dealerPrice, setDealerPrice] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("XAU");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/prices");
      const data = await res.json();
      setPrices(Array.isArray(data) ? data : []);
    } catch {
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const metalOptions = useMemo(() => {
    const set = new Set(
      prices
        .map((p) => (p?.metal ? String(p.metal).toUpperCase() : null))
        .filter(Boolean)
    );
    const list = Array.from(set);
    list.sort();
    return list.length ? list : ["XAU", "XAG", "XPT", "XPD"];
  }, [prices]);

  useEffect(() => {
    if (!metalOptions.includes(selectedMetal)) setSelectedMetal(metalOptions[0] || "XAU");
  }, [metalOptions, selectedMetal]);

  const spot = useMemo(() => {
    const row =
      prices.find((p) => String(p?.metal).toUpperCase() === selectedMetal) ??
      prices.find((p) => String(p?.metal).toUpperCase() === "XAU");
    return row?.price ?? row?.spot ?? row?.value ?? null;
  }, [prices, selectedMetal]);

  const premiumPct = useMemo(() => {
    const dp = Number(dealerPrice);
    const sp = Number(spot);
    if (!Number.isFinite(dp) || !Number.isFinite(sp) || sp <= 0) return null;
    return ((dp - sp) / sp) * 100;
  }, [dealerPrice, spot]);

  return (
    <div className="page">
      <section className="hero">
        <div className="shell heroShell">
          <div className="heroCopy">
            <div className="eyebrow">Spot snapshots. No noise.</div>
            <h1 className="heroTitle">Track metals. Set alerts. Move fast.</h1>
            <p className="heroSub">
              Prices update automatically. Create alerts for breaks above/below your target—then keep
              your dashboard clean with triggered alerts collapsed by default.
            </p>

            <div className="heroCtas">
              <Link href="/alerts/create" className="btn btnPrimaryLink btnLg">
                Create Alert
              </Link>
              <Link href="/alerts" className="btn btnGhostLink btnLg">
                View Alerts
              </Link>
            </div>

            <div className="heroMeta" aria-label="Quick info">
              <div className="metaPill">
                <span className="metaPillLabel">Selected</span>
                <span className="metaPillValue">{selectedMetal}</span>
              </div>
              <div className="metaPill">
                <span className="metaPillLabel">Spot</span>
                <span className="metaPillValue">{formatMoney(spot)}</span>
              </div>
              <div className="metaPill">
                <span className="metaPillLabel">Updates</span>
                <span className="metaPillValue">~15s</span>
              </div>
            </div>
          </div>

          <div className="heroPanel" aria-label="Spot prices">
            <div className="panelHeader">
              <div>
                <div className="panelTitle">Spot prices</div>
                <div className="panelSub">Live cache</div>
              </div>
              <Link href="/charts" className="panelLink">
                Charts →
              </Link>
            </div>

            {loading ? (
              <div className="skeletonList" aria-label="Loading prices">
                <div className="skeletonRow" />
                <div className="skeletonRow" />
                <div className="skeletonRow" />
                <div className="skeletonRow" />
              </div>
            ) : prices.length === 0 ? (
              <div className="emptyCompact">
                <p className="emptyCompactText">No prices available right now.</p>
              </div>
            ) : (
              <div className="priceGrid" role="list">
                {prices
                  .slice()
                  .sort((a, b) => String(a?.metal).localeCompare(String(b?.metal)))
                  .map((p) => {
                    const m = String(p?.metal || "").toUpperCase();
                    const val = p?.price ?? p?.spot ?? p?.value;
                    const isSelected = m === selectedMetal;
                    return (
                      <button
                        key={`${m}-${p?.id ?? ""}`}
                        className={`priceCard ${isSelected ? "priceCardActive" : ""}`}
                        onClick={() => setSelectedMetal(m)}
                        type="button"
                        aria-pressed={isSelected}
                      >
                        <div className="priceCardTop">
                          <div className="priceMetal">{m || "—"}</div>
                          <div className="priceValue">{formatMoney(val)}</div>
                        </div>
                        <div className="priceHint">Tap to compare</div>
                      </button>
                    );
                  })}
              </div>
            )}

            <div className="divider" />

            <div className="compare" aria-label="Dealer premium calculator">
              <div className="compareTitle">Dealer premium</div>

              <div className="compareRow">
                <label className="label" htmlFor="metalSelect">
                  Metal
                </label>
                <select
                  id="metalSelect"
                  className="input"
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                >
                  {metalOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="compareRow">
                <label className="label" htmlFor="dealerPrice">
                  Dealer price
                </label>
                <input
                  id="dealerPrice"
                  className="input"
                  inputMode="decimal"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2150.00"
                  value={dealerPrice}
                  onChange={(e) => setDealerPrice(e.target.value)}
                />
              </div>

              <div className="compareResult">
                <div className="compareBox">
                  <div className="compareBoxLabel">Spot</div>
                  <div className="compareBoxValue">{formatMoney(spot)}</div>
                </div>

                <div className="compareBox">
                  <div className="compareBoxLabel">Premium</div>
                  <div className="compareBoxValue">
                    {premiumPct == null ? "—" : `${premiumPct.toFixed(2)}%`}
                  </div>
                </div>
              </div>

              <div className="compareNote">
                Tip: Set alerts around your “buy zone” so you don’t miss dips.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Do more with alerts</h2>
            <div className="sectionRight">
              <Link href="/alerts" className="btn btnGhostLink">
                Open Dashboard
              </Link>
            </div>
          </div>

          <div className="featureGrid">
            <div className="featureCard">
              <div className="featureTitle">Fast create</div>
              <div className="featureSub">Pick a metal, set above/below, add a target.</div>
              <Link className="featureLink" href="/alerts/create">
                Create an alert →
              </Link>
            </div>

            <div className="featureCard">
              <div className="featureTitle">Clean dashboard</div>
              <div className="featureSub">Triggered alerts are grouped and collapsed by default.</div>
              <Link className="featureLink" href="/alerts">
                View alerts →
              </Link>
            </div>

            <div className="featureCard">
              <div className="featureTitle">Visual context</div>
              <div className="featureSub">Use charts to sanity check price moves before acting.</div>
              <Link className="featureLink" href="/charts">
                Open charts →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
