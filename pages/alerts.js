// pages/alerts.js
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function Badge({ variant, children }) {
  const cls =
    variant === "active"
      ? "badge badgeActive"
      : variant === "triggered"
      ? "badge badgeTriggered"
      : "badge";
  return <span className={cls}>{children}</span>;
}

function SectionHeader({ title, count, right }) {
  return (
    <div className="sectionHeader">
      <h2 className="sectionTitle">
        {title} <span className="sectionCount">({count})</span>
      </h2>
      <div className="sectionRight">{right}</div>
    </div>
  );
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);

  // editing state
  const [editingId, setEditingId] = useState(null);
  const [editDirection, setEditDirection] = useState("above");
  const [editTarget, setEditTarget] = useState("");

  // UI state
  const [showTriggered, setShowTriggered] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | ACTIVE | TRIGGERED
  const [metalFilter, setMetalFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest
  const [busyId, setBusyId] = useState(null);

  async function loadAlerts() {
    const res = await fetch("/api/alerts");
    const json = await res.json();
    setAlerts(Array.isArray(json) ? json : []);
  }

  useEffect(() => {
    loadAlerts();
  }, []);

  const metals = useMemo(() => {
    const set = new Set(alerts.map((a) => a.metal).filter(Boolean));
    return ["ALL", ...Array.from(set).sort()];
  }, [alerts]);

  const filtered = useMemo(() => {
    let list = [...alerts];

    if (statusFilter === "ACTIVE") list = list.filter((a) => !a.triggered);
    if (statusFilter === "TRIGGERED") list = list.filter((a) => a.triggered);

    if (metalFilter !== "ALL") list = list.filter((a) => a.metal === metalFilter);

    list.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortOrder === "newest" ? db - da : da - db;
    });

    list.sort((a, b) => Number(a.triggered) - Number(b.triggered));

    return list;
  }, [alerts, statusFilter, metalFilter, sortOrder]);

  const activeAlerts = useMemo(() => filtered.filter((a) => !a.triggered), [filtered]);
  const triggeredAlerts = useMemo(() => filtered.filter((a) => a.triggered), [filtered]);

  function startEdit(a) {
    setEditingId(a.id);
    setEditDirection(a.direction || "above");
    setEditTarget(String(a.target ?? ""));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDirection("above");
    setEditTarget("");
  }

  async function saveEdit(id) {
    const targetNum = Number(editTarget);
    if (!editTarget || Number.isNaN(targetNum) || targetNum <= 0) return;

    setBusyId(id);
    try {
      await fetch("/api/alerts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, direction: editDirection, target: targetNum }),
      });
      cancelEdit();
      await loadAlerts();
    } finally {
      setBusyId(null);
    }
  }

  async function rearmAlert(id) {
    setBusyId(id);
    try {
      await fetch("/api/alerts/rearm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await loadAlerts();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteAlert(id) {
    if (!confirm("Delete this alert?")) return;
    setBusyId(id);
    try {
      await fetch("/api/alerts/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await loadAlerts();
    } finally {
      setBusyId(null);
    }
  }

  function AlertCard({ a }) {
    const isEditing = editingId === a.id;
    const isBusy = busyId === a.id;

    const currentPrice =
      a.currentPrice != null && !Number.isNaN(Number(a.currentPrice))
        ? Number(a.currentPrice)
        : null;

    return (
      <article className="card cardNike" aria-label={`Alert for ${a.metal}`}>
        <div className="cardTop">
          <div className="cardTitleRow">
            {!isEditing ? (
              <div className="cardTitle">
                Notify me when <strong>{a.metal}</strong> goes{" "}
                <strong>{a.direction}</strong>{" "}
                <strong>${Number(a.target).toFixed(2)}</strong>
              </div>
            ) : (
              <div className="editRow" aria-label="Edit alert">
                <label className="srOnly" htmlFor={`dir-${a.id}`}>
                  Direction
                </label>
                <select
                  id={`dir-${a.id}`}
                  className="input"
                  value={editDirection}
                  onChange={(e) => setEditDirection(e.target.value)}
                  disabled={isBusy}
                >
                  <option value="above">Above</option>
                  <option value="below">Below</option>
                </select>

                <label className="srOnly" htmlFor={`target-${a.id}`}>
                  Target price
                </label>
                <input
                  id={`target-${a.id}`}
                  className="input"
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={editTarget}
                  onChange={(e) => setEditTarget(e.target.value)}
                  disabled={isBusy}
                  placeholder="Target"
                />
              </div>
            )}
          </div>

          <div className="cardBadges">
            {a.triggered ? (
              <Badge variant="triggered">TRIGGERED</Badge>
            ) : (
              <Badge variant="active">ACTIVE</Badge>
            )}
          </div>
        </div>

        <div className="cardMeta">
          <div className="metaItem">
            <span className="metaLabel">Current</span>
            <span className="metaValue">
              {currentPrice == null ? "—" : `$${currentPrice.toFixed(2)}`}
            </span>
          </div>

          <div className="metaItem">
            <span className="metaLabel">Email</span>
            <span className="metaValue">{a.email || "—"}</span>
          </div>
        </div>

        <div className="cardActions" role="group" aria-label="Alert actions">
          {!isEditing ? (
            <>
              <button
                className="btn btnPrimary"
                onClick={() => startEdit(a)}
                disabled={isBusy}
              >
                Edit
              </button>

              {a.triggered && (
                <button
                  className="btn btnSuccess"
                  onClick={() => rearmAlert(a.id)}
                  disabled={isBusy}
                >
                  Re-arm
                </button>
              )}

              <button
                className="btn btnDanger"
                onClick={() => deleteAlert(a.id)}
                disabled={isBusy}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btnPrimary"
                onClick={() => saveEdit(a.id)}
                disabled={
                  isBusy ||
                  !editTarget ||
                  Number.isNaN(Number(editTarget)) ||
                  Number(editTarget) <= 0
                }
              >
                Save
              </button>
              <button className="btn btnGhost" onClick={cancelEdit} disabled={isBusy}>
                Cancel
              </button>
            </>
          )}
        </div>
      </article>
    );
  }

  return (
    <div className="page">
      <section className="section sectionTight">
        <div className="shell">
          <div className="pageHeader">
            <div>
              <div className="eyebrow">Alerts</div>
              <h1 className="pageTitle">Your dashboard</h1>
              <p className="pageSub">
                Create, edit, and manage alerts. Triggered alerts are tucked away to keep the page
                clean.
              </p>
            </div>

            <div className="pageHeaderRight">
              <Link href="/alerts/create" className="btn btnPrimaryLink">
                + Create Alert
              </Link>
              <Link href="/charts" className="btn btnGhostLink">
                Charts
              </Link>
            </div>
          </div>

          <div className="toolbar" aria-label="Filters">
            <div className="toolbarGroup">
              <label className="label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="ACTIVE">Active</option>
                <option value="TRIGGERED">Triggered</option>
              </select>
            </div>

            <div className="toolbarGroup">
              <label className="label" htmlFor="metal">
                Metal
              </label>
              <select
                id="metal"
                className="input"
                value={metalFilter}
                onChange={(e) => setMetalFilter(e.target.value)}
              >
                {metals.map((m) => (
                  <option key={m} value={m}>
                    {m === "ALL" ? "All" : m}
                  </option>
                ))}
              </select>
            </div>

            <div className="toolbarGroup">
              <label className="label" htmlFor="sort">
                Sort
              </label>
              <select
                id="sort"
                className="input"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            <div className="toolbarGroup">
              <div className="label">Quick</div>
              <Link href="/alerts/create" className="btn btnGhostLink">
                New alert →
              </Link>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <p className="emptyTitle">No alerts yet.</p>
              <p className="emptySub">Create one in under 20 seconds.</p>
              <Link href="/alerts/create" className="btn btnPrimaryLink btnLg">
                Create your first alert
              </Link>
            </div>
          ) : (
            <>
              <SectionHeader title="Active Alerts" count={activeAlerts.length} />

              {activeAlerts.length === 0 ? (
                <div className="emptyCompact">
                  <p className="emptyCompactText">No active alerts match your filters.</p>
                </div>
              ) : (
                <div className="cards">
                  {activeAlerts.map((a) => (
                    <AlertCard key={a.id} a={a} />
                  ))}
                </div>
              )}

              <SectionHeader
                title="Triggered Alerts"
                count={triggeredAlerts.length}
                right={
                  <button
                    className="btn btnGhost"
                    onClick={() => setShowTriggered((v) => !v)}
                    aria-expanded={showTriggered}
                    aria-controls="triggered-section"
                  >
                    {showTriggered ? "Hide" : "Show"}
                  </button>
                }
              />

              <div id="triggered-section">
                {showTriggered ? (
                  triggeredAlerts.length === 0 ? (
                    <div className="emptyCompact">
                      <p className="emptyCompactText">No triggered alerts match your filters.</p>
                    </div>
                  ) : (
                    <div className="cards">
                      {triggeredAlerts.map((a) => (
                        <AlertCard key={a.id} a={a} />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="collapsedHint">
                    Triggered alerts are hidden by default to keep your dashboard clean.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
