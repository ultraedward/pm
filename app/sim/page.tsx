export const dynamic = "force-dynamic"

let price = 2400

function tick() {
  const delta = (Math.random() - 0.5) * 10
  price = Math.round((price + delta) * 100) / 100
  return price
}

export default function SimPage() {
  const currentPrice = tick()
  const alertTriggered = currentPrice >= 2425

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      {alertTriggered && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            padding: 16,
            background: "#b00020",
            color: "white",
            fontWeight: 700,
            textAlign: "center",
            zIndex: 9999,
          }}
        >
          🚨 ALERT FIRED — ${currentPrice}
        </div>
      )}

      <h1>Simulated Gold Price</h1>

      <div style={{ fontSize: 48, marginTop: 20 }}>
        ${currentPrice}
      </div>

      <meta httpEquiv="refresh" content="3" />
    </main>
  )
}
