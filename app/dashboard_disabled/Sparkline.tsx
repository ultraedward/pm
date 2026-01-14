"use client"

import { useMemo } from "react"

type SparkPoint = { t: number; v: number }
type AlertLine = { v: number }

type HitPoint = {
  x: number
  y: number
}

export default function Sparkline({
  points,
  alerts,
  up,
}: {
  points: SparkPoint[]
  alerts: AlertLine[]
  up: boolean
}) {
  const width = 80
  const height = 24
  const padding = 2

  if (points.length < 2) {
    return (
      <svg width={width} height={height} className="text-gray-600">
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  const values = [
    ...points.map((p) => p.v),
    ...alerts.map((a) => a.v),
  ]

  const maxAbs =
    Math.max(...values.map((v) => Math.abs(v))) || 1

  const zeroY = height / 2

  const path = useMemo(() => {
    return points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * width
        const y =
          zeroY - (p.v / maxAbs) * (height / 2 - padding)
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(" ")
  }, [points, maxAbs])

  // 🔥 Compute alert hit points
  const hits: HitPoint[] = []

  alerts.forEach((alert) => {
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1].v
      const curr = points[i].v

      const crossed =
        (prev < alert.v && curr >= alert.v) ||
        (prev > alert.v && curr <= alert.v)

      if (crossed) {
        const x =
          (i / (points.length - 1)) * width

        const y =
          zeroY -
          (alert.v / maxAbs) * (height / 2 - padding)

        hits.push({ x, y })
      }
    }
  })

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={up ? "text-green-500" : "text-red-500"}
    >
      {/* zero line */}
      <line
        x1="0"
        y1={zeroY}
        x2={width}
        y2={zeroY}
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
      />

      {/* alert lines */}
      {alerts.map((a, i) => {
        const y =
          zeroY - (a.v / maxAbs) * (height / 2 - padding)
        return (
          <line
            key={i}
            x1="0"
            y1={y}
            x2={width}
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeDasharray="3 2"
            strokeWidth="1"
          />
        )
      })}

      {/* price path */}
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 🔴 alert hit dots */}
      {hits.map((h, i) => (
        <circle
          key={i}
          cx={h.x}
          cy={h.y}
          r="2.5"
          fill="currentColor"
          stroke="white"
          strokeWidth="1"
        />
      ))}
    </svg>
  )
}
