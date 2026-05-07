'use client'

import { useEffect, useState } from 'react'

interface RiskGaugeProps {
  score: number // 0–100
}

export function RiskGauge({ score }: RiskGaugeProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const radius = 72
  const strokeWidth = 10
  const cx = 90
  const cy = 90

  // Arc spans from 220° to -40° (260° total sweep, bottom-start to bottom-end)
  const startAngle = -220
  const endAngle = 40
  const totalSweep = 260

  const toRad = (deg: number) => (deg * Math.PI) / 180

  const getPoint = (angleDeg: number) => {
    const rad = toRad(angleDeg)
    // Round to avoid floating point precision issues between server/client
    return {
      x: Math.round((cx + radius * Math.cos(rad)) * 1000) / 1000,
      y: Math.round((cy + radius * Math.sin(rad)) * 1000) / 1000,
    }
  }

  const describeArc = (fromDeg: number, toDeg: number) => {
    const start = getPoint(fromDeg)
    const end = getPoint(toDeg)
    const largeArc = toDeg - fromDeg > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`
  }

  const fillAngle = startAngle + (score / 100) * totalSweep

  const trackPath = describeArc(startAngle, endAngle)
  const fillPath = describeArc(startAngle, fillAngle)

  // Color based on score
  const gaugeColor =
    score >= 70 ? '#F59E0B' : score >= 40 ? '#F97316' : '#22C55E'
  const riskLabel =
    score >= 85 ? 'High' : score >= 70 ? 'Medium' : 'Low'

  // Don't render SVG until client-side to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-col items-center">
        <div style={{ width: 180, height: 120 }} />
        <p className="text-sm mt-1" style={{ color: '#6B6B8A' }}>
          Risk Score: <span style={{ color: gaugeColor }} className="font-semibold">{score}% ({riskLabel})</span>
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={180} height={120} viewBox="0 0 180 120">
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="#1E1E35"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={fillPath}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${gaugeColor}80)` }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={gaugeColor}
          fontSize={28}
          fontWeight="700"
          fontFamily="DM Sans, sans-serif"
        >
          {score}%
        </text>
      </svg>
      <p className="text-sm mt-1" style={{ color: '#6B6B8A' }}>
        Risk Score:{' '}
        <span style={{ color: gaugeColor }} className="font-semibold">
          {score}% ({riskLabel})
        </span>
      </p>
    </div>
  )
}
