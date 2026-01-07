"use client"

type SparkPoint = {
  t: number
  p: number
}

export default function Sparkline({
  points,
  up,
}: {
  points: SparkPoint[]
  up: boolean
}) {
  if (points.length < 2) {
    return (
      <svg width={80} height={24} className="text-gray-600">
        <line
          x1="0"
          y1="12"
          x2="80"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  const width = 80
  const height = 24

  const prices = points.map((p) => p.p)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || min * 0.001 || 1

  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * width
      const y = height - ((p.p - min) / range) * (height - 4) - 2
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={up ? "text-green-500" : "text-red-500"}
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
