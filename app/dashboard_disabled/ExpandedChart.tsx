"use client"

type SparkPoint = { t: number; v: number }
type AlertLine = { v: number }

export default function ExpandedChart({
  points,
  alerts,
}: {
  points: SparkPoint[]
  alerts: AlertLine[]
}) {
  const width = 600
  const height = 200
  const padding = 20

  const values = [
    ...points.map((p) => p.v),
    ...alerts.map((a) => a.v),
  ]
  const maxAbs =
    Math.max(...values.map((v) => Math.abs(v))) || 1

  const zeroY = height / 2

  const path = points
    .map((p, i) => {
      const x =
        padding +
        (i / (points.length - 1)) * (width - padding * 2)
      const y =
        zeroY -
        (p.v / maxAbs) * (height / 2 - padding)
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="bg-neutral-900 rounded-lg"
    >
      {/* zero */}
      <line
        x1={padding}
        y1={zeroY}
        x2={width - padding}
        y2={zeroY}
        stroke="white"
        strokeOpacity="0.2"
      />

      {/* alerts */}
      {alerts.map((a, i) => {
        const y =
          zeroY -
          (a.v / maxAbs) * (height / 2 - padding)
        return (
          <line
            key={i}
            x1={padding}
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="white"
            strokeDasharray="4 3"
            strokeOpacity="0.4"
          />
        )
      })}

      {/* price */}
      <path
        d={path}
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  )
}
