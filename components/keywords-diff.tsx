"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { KeywordsResult } from "@/types/analyse"
import { cn } from "@/lib/utils"

interface KeywordsDiffProps {
  keywords: KeywordsResult
}

export function KeywordsDiff({ keywords }: KeywordsDiffProps) {
  const { presents, manquants, taux_matching } = keywords

  const getMatchColor = () => {
    if (taux_matching >= 70) return "text-green-400"
    if (taux_matching >= 40) return "text-orange-400"
    return "text-red-400"
  }

  const getMatchBg = () => {
    if (taux_matching >= 70) return "bg-green-500"
    if (taux_matching >= 40) return "bg-orange-400"
    return "bg-red-500"
  }

  return (
    <div className="rounded-xl border border-[#475569] bg-[#1e293b] p-5">
      {/* En-tête avec taux de matching */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Analyse des mots-clés</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94a3b8]">Matching :</span>
          <span className={cn("text-sm font-bold tabular-nums", getMatchColor())}>
            {taux_matching}%
          </span>
        </div>
      </div>

      {/* Barre de progression matching */}
      <div className="mb-5 h-2 w-full rounded-full bg-[#0f172a] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", getMatchBg())}
          style={{ width: `${taux_matching}%` }}
          role="progressbar"
          aria-valuenow={taux_matching}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Taux de matching : ${taux_matching}%`}
        />
      </div>

      {/* Deux colonnes : présents | manquants */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Mots-clés présents */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
            <span className="text-xs font-medium text-green-400">
              Présents ({presents.length})
            </span>
          </div>
          {presents.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {presents.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-md bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-xs font-medium text-green-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#94a3b8] italic">Aucun mot-clé détecté</p>
          )}
        </div>

        {/* Mots-clés manquants */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <XCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span className="text-xs font-medium text-red-400">
              Manquants ({manquants.length})
            </span>
          </div>
          {manquants.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {manquants.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-md bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#94a3b8] italic">
              Tous les mots-clés sont présents !
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
