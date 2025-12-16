import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const { token } = router.query;
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (token) {
      window.location.href = `/api/login-callback?token=${token}`;
    }
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    setSent(true);
  }

  if (sent) {
    return <main><h1>Check your email</h1></main>;
  }

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button>Send login link</button>
      </form>
    </main>
  );
}
