import { useEffect, useState } from "react";
import Head from "next/head";

export default function PricingPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [subStatus, setSubStatus] = useState({ subscribed: false, status: "none" });
  const [subLoading, setSubLoading] = useState(true);

  const refreshSubscription = async () => {
    setSubLoading(true);
    try {
      const res = await fetch("/api/subscription");
      if (!res.ok) throw new Error("Sub status failed");
      const data = await res.json();
      setSubStatus(data);
    } catch {
      setSubStatus({ subscribed: false, status: "unknown" });
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") setMessage("✅ Subscription successful! You can now create alerts.");
    if (params.get("canceled") === "true") setMessage("❌ Checkout canceled. You were not charged.");
    refreshSubscription();
  }, []);

  const login = async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      if (!res.ok) throw new Error("Login failed");
      setMessage("✅ Logged in.");
      await refreshSubscription();
    } catch (err) {
      console.error(err);
      setError("Unable to log in.");
    }
  };

  const logout = async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      setMessage("✅ Logged out.");
      await refreshSubscription();
    } catch (err) {
      console.error(err);
      setError("Unable to log out.");
    }
  };

  const subscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", { method: "POST" });

      if (res.status === 401) throw new Error("Please log in first.");
      if (res.status === 409) {
        setMessage("✅ You already have an active subscription.");
        setLoading(false);
        await refreshSubscription();
        return;
      }
      if (!res.ok) throw new Error("Failed to start checkout");

      const data = await res.json();
      if (!data.url) throw new Error("No checkout URL returned");
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to start checkout.");
      setLoading(false);
    }
  };

  const openBillingPortal = async () => {
    setBillingLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      if (res.status === 401) throw new Error("Please log in first.");
      if (!res.ok) throw new Error("Failed to open billing portal");

      const data = await res.json();
      if (!data.url) throw new Error("No billing portal URL returned");
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to open billing portal.");
      setBillingLoading(false);
    }
  };

  const subscribed = subStatus.subscribed === true;

  return (
    <>
      <Head><title>Pricing | Precious Metals Alerts</title></Head>

      <main style={{ maxWidth: "650px", margin: "60px auto", padding: "20px" }}>
        <h1>Pricing</h1>

        {message && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: 12, borderRadius: 6, marginBottom: 16 }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: 12, borderRadius: 6, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, marginBottom: 24 }}>
          <h2 style={{ marginTop: 0 }}>Login</h2>

          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" style={{ flex: 1, padding: 10 }} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ flex: 2, padding: 10 }} />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={login} style={{ padding: "10px 14px" }}>Log in</button>
            <button onClick={logout} style={{ padding: "10px 14px" }}>Log out</button>

            <div style={{ marginLeft: "auto", fontSize: 14, opacity: 0.9 }}>
              {subLoading ? "Checking subscription…" : subscribed ? "✅ Subscription: Active" : `Subscription: ${subStatus.status}`}
            </div>
          </div>
        </section>

        <section style={{ border: "1px solid #ccc", borderRadius: 8, padding: 24 }}>
          <h2>Pro Plan</h2>
          <p><strong>$9.99 / month</strong></p>
          <ul>
            <li>✔️ Unlimited price alerts</li>
            <li>✔️ Gold, silver, platinum</li>
            <li>✔️ Cancel anytime</li>
          </ul>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={subscribe} disabled={loading || subscribed} style={{ padding: "12px 20px" }}>
              {subscribed ? "Subscribed" : loading ? "Redirecting…" : "Subscribe"}
            </button>

            <button onClick={openBillingPortal} disabled={billingLoading} style={{ padding: "12px 20px" }}>
              {billingLoading ? "Opening…" : "Manage Billing"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
