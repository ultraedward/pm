// pages/alerts.js
import Head from "next/head";
import { useState, useEffect } from "react";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("alerts") || "[]");
    setAlerts(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("alerts", JSON.stringify(alerts));
  }, [alerts]);

  function addAlert(e) {
    e.preventDefault();
    const form = e.target;
    const metal = form.metal.value;
    const direction = form.direction.value;
    const threshold = parseFloat(form.threshold.value);
    if (!metal || !direction || !threshold) {
      alert("All fields are required");
      return;
    }
    setAlerts([...alerts, { metal, direction, threshold }]);
    form.reset();
  }

  function removeAlert(idx) {
    setAlerts(alerts.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <Head>
        <title>Alerts | Precious Metals Tracker</title>
      </Head>
      <h2>Price Alerts</h2>
      <form onSubmit={addAlert} className="form">
        <select name="metal" required>
          <option value="XAU">Gold (XAU)</option>
          <option value="XAG">Silver (XAG)</option>
          <option value="XPT">Platinum (XPT)</option>
          <option value="XPD">Palladium (XPD)</option>
        </select>
        <select name="direction" required>
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <input
          name="threshold"
          type="number"
          step="0.01"
          placeholder="Price"
          required
        />
        <button type="submit" className="submit-btn">
          Add Alert
        </button>
      </form>

      {!alerts.length && <p className="info">No alerts set.</p>}
      {alerts.length > 0 && (
        <ul className="list">
          {alerts.map((a, i) => (
            <li key={i}>
              {a.metal} {a.direction} ${a.threshold.toFixed(2)}
              <button
                onClick={() => removeAlert(i)}
                className="remove-btn"
                style={{ marginLeft: 8 }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
