import { useEffect, useState } from "react";
import Head from "next/head";

export default function AccountPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/stats");

        if (res.status === 401) {
          setError("Please log in to view your account.");
          setStats(null);
          return;
        }

        if (res.status === 402) {
          setError("An active subscription is required.");
          setStats(null);
          return;
        }

        if (!res.ok) {
          throw new Error("Stats request failed");
        }

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Account stats error:", err);
        setError("Unable to load account data.");
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <>
      <Head>
        <title>Account | Precious Metals Alerts</title>
      </Head>

      <main style={{ maxWidth: 700, margin: "60px auto", padding: 20 }}>
        <h1>Account</h1>

        {loading && <p>Loading…</p>}

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              padding: 12,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {!loading && stats && (
          <>
            <section
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <h2 style={{ marginTop: 0 }}>Subscription</h2>
              <p>
                Status: <strong>{stats.subscriptionStatus}</strong>
              </p>
              <p>Manage billing from the Pricing page.</p>
            </section>

            <section
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <h2 style={{ marginTop: 0 }}>Usage</h2>
              <p>
                Alerts total: <strong>{stats.alertsTotal}</strong>
              </p>
              <p>
                Alerts active: <strong>{stats.alertsActive}</strong>
              </p>
            </section>
          </>
        )}
      </main>
    </>
  );
}
