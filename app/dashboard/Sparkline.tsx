"use client"

import { useMemo, useRef, useState } from "react"

type SparkPoint = {
  t: number // timestamp (ms)
  v: number // percent change
}

export default function Sparkline({
  points,
  up,
}: {
  points: SparkPoint[]
  up: boolean
}) {
  const width = 80
  const height = 24
  const padding = 2
  const svgRef = useRef<SVGSVGElement | null>(null)

  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  // Handle very small datasets
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

  const values = points.map((p) => p.v)
  const maxAbs = Math.max(...values.map((v) => Math.abs(v))) || 1
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

  function onMove(e: React.MouseEvent) {
    if (!svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const idx = Math.round(
      (x / width) * (points.length - 1)
    )

    const clamped = Math.max(
      0,
      Math.min(points.length - 1, idx)
    )

    setHoverIdx(clamped)
  }

  function onLeave() {
    setHoverIdx(null)
  }

  const hoverPoint =
    hoverIdx !== null ? points[hoverIdx] : null

  const hoverX =
    hoverIdx !== null
      ? (hoverIdx / (points.length - 1)) * width
      : 0

  const hoverY =
    hoverPoint !== null
      ? zeroY -
        (hoverPoint.v / maxAbs) * (height / 2 - padding)
      : 0

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={up ? "text-green-500" : "text-red-500"}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
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

        {/* main path */}
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* hover guide */}
        {hoverIdx !== null && (
          <>
            <line
              x1={hoverX}
              y1="0"
              x2={hoverX}
              y2={height}
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="1"
            />
            <circle
              cx={hoverX}
              cy={hoverY}
              r="2.5"
              fill="currentColor"
            />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {hoverPoint && (
        <div
          className="absolute z-10 px-2 py-1 text-xs rounded bg-black text-white whitespace-nowrap pointer-events-none"
          style={{
            left: hoverX + 6,
            top: -28,
          }}
        >
          <div>
            {new Date(hoverPoint.t).toLocaleString()}
          </div>
          <div className="font-medium">
            {hoverPoint.v >= 0 ? "+" : ""}
            {hoverPoint.v.toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  )
}
