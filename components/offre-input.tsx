"use client"

import { useId } from "react"
import { AlertCircle, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

export interface OffreInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

const MIN_CHARS = 50
const MAX_CHARS = 5000

export function OffreInput({ value, onChange, error }: OffreInputProps) {
  const id = useId()
  const count = value.length
  const isUnderMin = count > 0 && count < MIN_CHARS
  const isOverMax = count > MAX_CHARS
  const isValid = count >= MIN_CHARS && count <= MAX_CHARS

  const getCounterColor = () => {
    if (isOverMax) return "text-red-400"
    if (isUnderMin) return "text-orange-400"
    if (isValid) return "text-[#94a3b8]"
    return "text-[#94a3b8]"
  }

  return (
    <div className="w-full">
      {/* Label */}
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-white"
      >
        <Briefcase className="h-4 w-4 text-blue-400" />
        Offre d&apos;emploi
        <span className="text-[#94a3b8] font-normal">(texte brut)</span>
      </label>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Colle ici le texte complet de l'offre d'emploi : missions, compétences requises, expérience demandée, stack technique, etc.

Plus l'offre est complète, plus l'analyse sera précise."
          rows={8}
          maxLength={MAX_CHARS + 500} // Légère tolérance avant de bloquer
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          aria-invalid={!!error || isOverMax}
          className={cn(
            "w-full resize-none rounded-xl border bg-[#1e293b] px-4 py-3 text-sm text-white placeholder:text-[#475569]",
            "transition-colors duration-200 outline-none",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500/50",
            "scrollbar-thin scrollbar-thumb-[#334155] scrollbar-track-transparent",
            // État normal
            !error && !isOverMax && "border-[#475569]",
            // Validation en cours
            isUnderMin && !error && "border-orange-500/40 focus:ring-orange-500",
            // Valide
            isValid && !error && "border-[#475569] focus:ring-blue-500",
            // Erreur
            (error || isOverMax) && "border-red-500/50 focus:ring-red-500",
          )}
        />

        {/* Indicateur de validation inline */}
        {isValid && (
          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
            <span className="text-green-400 text-xs font-bold">✓</span>
          </div>
        )}
      </div>

      {/* Barre de progression */}
      <div className="mt-2 h-1 w-full rounded-full bg-[#1e293b] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            isOverMax && "bg-red-500",
            isUnderMin && count > 0 && "bg-orange-400",
            isValid && "bg-green-500",
            count === 0 && "bg-[#334155]",
          )}
          style={{
            width: `${Math.min((count / MIN_CHARS) * 100, 100)}%`,
          }}
        />
      </div>

      {/* Footer : hint + compteur */}
      <div className="mt-1.5 flex items-start justify-between gap-2">
        <div className="flex-1">
          {/* Erreur de validation externe */}
          {error && (
            <p
              id={`${id}-error`}
              role="alert"
              className="flex items-center gap-1.5 text-xs text-red-400"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}

          {/* Hint dynamique */}
          {!error && (
            <p id={`${id}-hint`} className="text-xs text-[#94a3b8]">
              {count === 0 && "Minimum 50 caractères requis"}
              {isUnderMin && `Encore ${MIN_CHARS - count} caractères pour continuer`}
              {isValid && "Parfait ! L'offre est prête à être analysée."}
              {isOverMax && `Trop long ! Réduisez de ${count - MAX_CHARS} caractères.`}
            </p>
          )}
        </div>

        {/* Compteur de caractères */}
        <p className={cn("text-xs tabular-nums shrink-0", getCounterColor())}>
          {count.toLocaleString("fr-FR")} / {MAX_CHARS.toLocaleString("fr-FR")}
        </p>
      </div>
    </div>
  )
}
