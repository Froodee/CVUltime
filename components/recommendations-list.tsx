"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Lightbulb, AlertTriangle, Info } from "lucide-react"
import { Recommandation } from "@/types/analyse"
import { cn, getImpact } from "@/lib/utils"

interface RecommendationsListProps {
  recommandations: Recommandation[]
}

// Groupement par impact avec ordre de priorité
const ORDRE_IMPACT: Recommandation["impact"][] = ["fort", "moyen", "faible"]

const IMPACT_CONFIG = {
  fort: {
    label: "Impact fort",
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  moyen: {
    label: "Impact moyen",
    icon: Lightbulb,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  faible: {
    label: "Impact faible",
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
}

interface RecommandationItemProps {
  reco: Recommandation
  index: number
}

function RecommandationItem({ reco, index }: RecommandationItemProps) {
  const [isOpen, setIsOpen] = useState(index === 0)
  const config = IMPACT_CONFIG[reco.impact]

  return (
    <div
      className={cn(
        "rounded-lg border transition-all duration-200",
        config.bg,
        config.border
      )}
    >
      {/* Header cliquable */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-start gap-3 p-3 text-left"
        aria-expanded={isOpen}
      >
        <div
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            config.bg,
            config.color
          )}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide">
              {reco.section}
            </span>
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs font-medium",
                getImpact(reco.impact)
              )}
            >
              {config.label}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-white line-clamp-2">
            {reco.probleme}
          </p>
        </div>
        <span className={cn("shrink-0 mt-0.5", config.color)}>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      {/* Contenu dépliable : solution */}
      {isOpen && (
        <div className="border-t border-[#475569]/30 px-3 pb-3 pt-2">
          <div className="flex items-start gap-2">
            <Lightbulb className={cn("h-4 w-4 shrink-0 mt-0.5", config.color)} />
            <div>
              <p className="text-xs font-medium text-[#94a3b8] mb-1">Solution recommandée</p>
              <p className="text-sm text-[#cbd5e1]">{reco.solution}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function RecommendationsList({ recommandations }: RecommendationsListProps) {
  if (recommandations.length === 0) {
    return (
      <div className="rounded-xl border border-[#475569] bg-[#1e293b] p-5 text-center">
        <Lightbulb className="mx-auto h-8 w-8 text-green-400 mb-2" />
        <p className="text-sm text-green-400 font-medium">Excellent CV !</p>
        <p className="text-xs text-[#94a3b8] mt-1">
          Aucune recommandation majeure. Ton CV est bien optimisé pour les ATS.
        </p>
      </div>
    )
  }

  // Grouper par impact
  const grouped = ORDRE_IMPACT.reduce(
    (acc, impact) => {
      const items = recommandations.filter((r) => r.impact === impact)
      if (items.length > 0) acc[impact] = items
      return acc
    },
    {} as Partial<Record<Recommandation["impact"], Recommandation[]>>
  )

  let globalIndex = 0

  return (
    <div className="rounded-xl border border-[#475569] bg-[#1e293b] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-blue-400" />
        Recommandations ({recommandations.length})
      </h3>

      <div className="space-y-4">
        {ORDRE_IMPACT.map((impact) => {
          const items = grouped[impact]
          if (!items) return null

          return (
            <div key={impact}>
              <div className="mb-2 flex items-center gap-2">
                <div className={cn("h-1.5 w-1.5 rounded-full", {
                  "bg-red-400": impact === "fort",
                  "bg-orange-400": impact === "moyen",
                  "bg-blue-400": impact === "faible",
                })} />
                <span className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
                  {IMPACT_CONFIG[impact].label} — {items.length} point{items.length > 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((reco) => {
                  const idx = globalIndex++
                  return (
                    <RecommandationItem key={idx} reco={reco} index={idx} />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
