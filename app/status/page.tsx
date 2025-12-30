// /app/status/page.tsx
"use client";

import { useEffect, useState } from "react";

type CronStatus = {
  ok: boolean;
  lastRun?: string;
  message?: string;
};

async function safeJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function StatusPage() {
  const [status, setStatus] = useState<CronStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStatus() {
    setLoading(true);
    const data = await safeJson("/api/cron-status");
    setStatus(data);
    setLoading(false);
  }

  useEffect(() => {
    loadStatus();
    const id = setInterval(loadStatus, 60_000);
    return () => clearInterval(id);
  }, []);

  const stateLabel = loading
    ? "Checking…"
    : status?.ok
      ? "Healthy"
      : "Stale / Error";

  return (
    <div className="wrap">
      <header className="header">
        <h1>System Status</h1>
        <span className="sub">Background Engine Health</span>
      </header>

      <section className="panel">
        <div className="row">
          <span className="label">Cron Engine</span>
          <span
            className={`badge ${
              loading ? "neutral" : status?.ok ? "ok" : "bad"
            }`}
          >
            {stateLabel}
          </span>
        </div>

        <div className="row">
          <span className="label">Last Run</span>
          <span className="value">
            {status?.lastRun
              ? new Date(status.lastRun).toLocaleString()
              : "—"}
          </span>
        </div>

        <div className="row">
          <span className="label">Message</span>
          <span className="value">
            {status?.message ?? "—"}
          </span>
        </div>

        <button onClick={loadStatus} className="refresh">
          Refresh
        </button>
      </section>

      <style jsx>{`
        body {
          background: #07080a;
        }

        .wrap {
          max-width: 800px;
          margin: 0 auto;
          padding: 24px;
          color: #e9ecf1;
        }

        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
        }

        .sub {
          font-size: 12px;
          color: #9aa0aa;
        }

        .panel {
          margin-top: 20px;
          background: #0d0f14;
          border: 1px solid #1f222a;
          border-radius: 22px;
          padding: 18px;
        }

        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #1f222a;
        }

        .row:last-child {
          border-bottom: none;
        }

        .label {
          font-size: 13px;
          font-weight: 800;
          color: #b3b8c4;
        }

        .value {
          font-size: 13px;
          font-weight: 800;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
        }

        .badge.ok {
          background: #1a2a1a;
          border: 1px solid #2a3a2a;
        }

        .badge.bad {
          background: #2a1a1a;
          border: 1px solid #3a2a2a;
        }

        .badge.neutral {
          background: #1a1f2a;
          border: 1px solid #2a2f3a;
        }

        .refresh {
          margin-top: 16px;
          width: 100%;
          background: #111318;
          border: 1px solid #2a2d36;
          border-radius: 14px;
          padding: 10px;
          font-weight: 900;
          cursor: pointer;
          color: #e9ecf1;
        }
      `}</style>
    </div>
  );
}
