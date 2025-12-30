import { prisma } from "../../lib/prisma"
import { Resend } from "resend"
import { saveAlertSettings } from "./actions"
import Nav from "../components/Nav"

export const dynamic = "force-dynamic"

const resend = new Resend(process.env.RESEND_API_KEY)

// normalization (display only)
const GOLD_NORMALIZATION_FACTOR = 0.55
const SILVER_NORMALIZATION_FACTOR = 0.98

function Sparkline({
  values,
  width = 120,
  height = 32,
}: {
  values: number[]
  width?: number
  height?: number
}) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const d = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  return (
    <svg width={width} height={height}>
      <path d={d} fill="none" stroke="#000" strokeWidth={1.5} />
    </svg>
  )
}

async function getState() {
  const settings =
    (await prisma.alertSettings.findFirst()) ?? {
      goldThreshold: 2500,
      silverThreshold: 30,
    }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)
  const recent = await prisma.pricePoint.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  })

  const goldSeries = recent
    .filter(p => p.metal === "gold")
    .map(p => p.price)

  const silverSeries = recent
    .filter(p => p.metal === "silver")
    .map(p => p.price)

  const res = await fetch(
    `https://metals-api.com/api/latest?access_key=${process.env.METALS_API_KEY}&base=USD&symbols=XAU,XAG`,
    { cache: "no-store" }
  )

  const data = await res.json()

  const gold =
    typeof data?.rates?.USDXAU === "number"
      ? Math.round(data.rates.USDXAU * GOLD_NORMALIZATION_FACTOR * 100) / 100
      : null

  const silver =
    typeof data?.rates?.USDXAG === "number"
      ? Math.round(data.rates.USDXAG * SILVER_NORMALIZATION_FACTOR * 100) / 100
      : null

  if (gold && gold >= settings.goldThreshold) {
    await prisma.alertEvent.create({
      data: { metal: "gold", price: gold },
    })

    await resend.emails.send({
      from: process.env.ALERT_EMAIL_FROM!,
      to: process.env.ALERT_EMAIL_TO!,
      subject: "🚨 GOLD ALERT",
      html: `<p>Gold crossed <strong>$${gold}</strong></p>`,
    })
  }

  if (silver && silver >= settings.silverThreshold) {
    await prisma.alertEvent.create({
      data: { metal: "silver", price: silver },
    })

    await resend.emails.send({
      from: process.env.ALERT_EMAIL_FROM!,
      to: process.env.ALERT_EMAIL_TO!,
      subject: "🚨 SILVER ALERT",
      html: `<p>Silver crossed <strong>$${silver}</strong></p>`,
    })
  }

  return { gold, silver, settings, goldSeries, silverSeries }
}

export default async function LivePage() {
  const { gold, silver, settings, goldSeries, silverSeries } =
    await getState()

  return (
    <main style={{ padding: 40, fontFamily: "system-ui", maxWidth: 520 }}>
      <Nav current="live" />

      <h1>Live Metals</h1>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: "#777" }}>Gold</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontSize: 40 }}>${gold ?? "--"}</div>
          <Sparkline values={goldSeries} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, color: "#777" }}>Silver</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ fontSize: 32 }}>${silver ?? "--"}</div>
          <Sparkline values={silverSeries} />
        </div>
      </div>

      <h2 style={{ marginTop: 32 }}>Alert Settings</h2>

      <form action={saveAlertSettings}>
        <label>
          Gold
          <input name="gold" defaultValue={settings.goldThreshold} />
        </label>
        <label>
          Silver
          <input name="silver" defaultValue={settings.silverThreshold} />
        </label>
        <button type="submit">Save</button>
      </form>

      <meta httpEquiv="refresh" content="600" />
    </main>
  )
}
