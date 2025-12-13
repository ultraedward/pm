import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e) {
    e.preventDefault();
    await fetch("/api/auth/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    setSent(true);
  }

  return (
    <main style={{ background:"#020617", color:"#e5e7eb", minHeight:"100vh", padding:24 }}>
      <div style={{ maxWidth:420, margin:"0 auto" }}>
        <h1>Login</h1>
        {!sent ? (
          <form onSubmit={submit}>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@example.com"
              style={{ width:"100%", padding:10, marginTop:12 }}
            />
            <button style={{ marginTop:12, padding:10, width:"100%" }}>Send magic link</button>
          </form>
        ) : (
          <p>Link sent (or skipped if email not configured).</p>
        )}
      </div>
    </main>
  );
}
