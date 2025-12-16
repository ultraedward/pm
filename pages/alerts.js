import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/alerts")
      .then(r => {
        if (r.status === 401) {
          router.push("/login");
          return [];
        }
        return r.json();
      })
      .then(setAlerts);
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Alerts</h1>

      {alerts.length === 0 && (
        <p>No alerts yet. Create one from the calculator.</p>
      )}

      {alerts.map(a => (
        <div key={a.id}>
          {a.metal} — Alert below {a.threshold}%
        </div>
      ))}
    </main>
  );
}
