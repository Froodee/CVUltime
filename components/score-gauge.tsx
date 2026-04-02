"use client"

import { useMemo } from "react"
import { getScoreHex, getScoreLabel } from "@/lib/utils"

interface ScoreGaugeProps {
  score: number
  label?: string
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

// Dimensions selon la taille
const SIZES = {
  sm: { width: 80, height: 80, strokeWidth: 6, fontSize: 18, labelSize: 10 },
  md: { width: 120, height: 120, strokeWidth: 8, fontSize: 28, labelSize: 12 },
  lg: { width: 180, height: 180, strokeWidth: 10, fontSize: 42, labelSize: 14 },
}

export function ScoreGauge({
  score,
  label,
  size = "md",
  showLabel = true,
}: ScoreGaugeProps) {
  const { width, height, strokeWidth, fontSize, labelSize } = SIZES[size]

  // Calcul de l'arc SVG
  const { circumference, dashOffset, cx, cy, radius } = useMemo(() => {
    const cx = width / 2
    const cy = height / 2
    // Rayon interne pour l'arc
    const radius = (Math.min(width, height) / 2) - strokeWidth - 2
    // On utilise un arc de 270° (de 135° à 405°, soit -225° à 45° en SVG)
    const arcAngle = 270
    const circumference = (arcAngle / 360) * (2 * Math.PI * radius)
    // Offset : 0% = arc complet, 100% = arc vide
    const clampedScore = Math.max(0, Math.min(100, score))
    const dashOffset = circumference * (1 - clampedScore / 100)

    return { circumference, dashOffset, cx, cy, radius }
  }, [score, width, height, strokeWidth])

  // Couleur selon le score
  const color = getScoreHex(score)
  const scoreLabel = getScoreLabel(score)

  // Rotation de départ : l'arc commence à 135° (bas-gauche) pour un arc en U ouvert vers le bas
  const startAngle = 135

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width, height }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          aria-label={`Score ATS : ${score} sur 100 — ${scoreLabel}`}
          role="img"
        >
          {/* Piste de fond (arc gris) */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${(270 / 360) * (2 * Math.PI * radius)} ${(90 / 360) * (2 * Math.PI * radius)}`}
            transform={`rotate(${startAngle}, ${cx}, ${cy})`}
          />

          {/* Arc de progression */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${(90 / 360) * (2 * Math.PI * radius) + circumference}`}
            strokeDashoffset={dashOffset}
            transform={`rotate(${startAngle}, ${cx}, ${cy})`}
            style={{
              transition: "stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease",
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />

          {/* Score au centre */}
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize={fontSize}
            fontWeight="700"
            fontFamily="var(--font-geist-sans), system-ui"
          >
            {Math.round(score)}
          </text>

          {/* Sous-texte "/100" */}
          <text
            x={cx}
            y={cy + fontSize * 0.55}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#94a3b8"
            fontSize={fontSize * 0.35}
            fontFamily="var(--font-geist-sans), system-ui"
          >
            / 100
          </text>
        </svg>
      </div>

      {/* Labels sous la jauge */}
      {showLabel && (
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="font-semibold"
            style={{ color, fontSize: labelSize }}
          >
            {scoreLabel}
          </span>
          {label && (
            <span
              className="text-[#94a3b8] text-center"
              style={{ fontSize: labelSize - 1 }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
