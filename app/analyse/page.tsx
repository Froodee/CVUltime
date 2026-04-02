"use client"

import { useState, useCallback, useEffect } from "react"
import { UploadCv } from "@/components/upload-cv"
import { OffreInput } from "@/components/offre-input"
import { ScoreResult } from "@/components/score-result"
import { AnalyseResult, AnalyseApiResponse } from "@/types/analyse"
import { cn } from "@/lib/utils"
import { BoutonAchat } from "@/components/bouton-achat"
import {
  Loader2,
  Zap,
  AlertCircle,
  Lock,
  ChevronRight,
  RotateCcw,
} from "lucide-react"

type EtatAnalyse = "idle" | "loading" | "success" | "error"

interface EtatFormulaire {
  cv: File | null
  offre: string
  erreurOffre: string
}

export default function AnalysePage() {
  const [formState, setFormState] = useState<EtatFormulaire>({
    cv: null,
    offre: "",
    erreurOffre: "",
  })
  const [etat, setEtat] = useState<EtatAnalyse>("idle")
  const [resultat, setResultat] = useState<AnalyseResult | null>(null)
  const [erreurGlobale, setErreurGlobale] = useState<string>("")
  const [creditsBloques, setCreditsBloques] = useState(false)

  // Vérification des crédits au chargement de la page
  useEffect(() => {
    async function verifierCredits() {
      try {
        const res = await fetch("/api/credits")
        const data = await res.json() as { allowed: boolean; reason?: string; code?: string }

        if (!data.allowed) {
          setCreditsBloques(true)
          setErreurGlobale(data.reason ?? "Analyse non disponible.")
        }
      } catch {
        // Erreur réseau : on laisse passer pour ne pas bloquer l'utilisateur
        console.warn("[Credits] Impossible de vérifier les crédits")
      }
    }

    verifierCredits()
  }, [])

  const handleFileSelect = useCallback((file: File | null) => {
    setFormState((prev) => ({ ...prev, cv: file }))
    // Réinitialise le résultat si on change le fichier
    if (resultat) {
      setResultat(null)
      setEtat("idle")
    }
  }, [resultat])

  const handleOffreChange = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, offre: value, erreurOffre: "" }))
  }, [])

  // Validation avant soumission
  function validerFormulaire(): boolean {
    if (!formState.cv) {
      setErreurGlobale("Veuillez sélectionner un fichier CV.")
      return false
    }

    if (formState.offre.trim().length < 50) {
      setFormState((prev) => ({
        ...prev,
        erreurOffre: "L'offre d'emploi doit faire au moins 50 caractères.",
      }))
      return false
    }

    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErreurGlobale("")
    setFormState((prev) => ({ ...prev, erreurOffre: "" }))

    if (!validerFormulaire()) return

    setEtat("loading")
    setResultat(null)

    try {
      const form = new FormData()
      form.append("cv", formState.cv!)
      form.append("offre", formState.offre.trim())

      const res = await fetch("/api/analyse", {
        method: "POST",
        body: form,
      })

      const json = (await res.json()) as AnalyseApiResponse

      if (!res.ok || !json.success) {
        // Gestion spéciale des crédits épuisés
        if (res.status === 402 || json.code === "NO_CREDITS") {
          setCreditsBloques(true)
          setErreurGlobale(
            json.error ?? "Analyse non disponible. Passez à la version premium."
          )
          setEtat("error")
          return
        }

        throw new Error(json.error ?? `Erreur serveur (${res.status})`)
      }

      if (!json.data) {
        throw new Error("Réponse invalide du serveur.")
      }

      setResultat(json.data)
      setEtat("success")

      // Scroll vers les résultats
      setTimeout(() => {
        document
          .getElementById("resultats")
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Une erreur inattendue s'est produite."
      setErreurGlobale(message)
      setEtat("error")
    }
  }

  function handleReset() {
    setFormState({ cv: null, offre: "", erreurOffre: "" })
    setResultat(null)
    setEtat("idle")
    setErreurGlobale("")
    setCreditsBloques(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const canSubmit =
    !creditsBloques &&
    etat !== "loading" &&
    !!formState.cv &&
    formState.offre.trim().length >= 50

  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* En-tête de page */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Analyse ATS de ton CV
          </h1>
          <p className="mt-3 text-[#94a3b8]">
            Upload ton CV et colle l&apos;offre d&apos;emploi pour obtenir ton score ATS
            et des recommandations précises.
          </p>
        </div>

        {/* Alerte crédits bloqués */}
        {creditsBloques && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
            <Lock className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-300">
                Analyse gratuite utilisée
              </p>
              <p className="mt-1 text-sm text-orange-300/80">{erreurGlobale}</p>
              <div className="mt-3">
                <BoutonAchat label="Acheter 1 analyse — 1€" />
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Upload CV */}
          <div className="rounded-xl border border-[#1e293b] bg-[#1e293b] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                1
              </span>
              Ton CV
            </h2>
            <UploadCv onFileSelect={handleFileSelect} file={formState.cv} />
          </div>

          {/* Offre d'emploi */}
          <div className="rounded-xl border border-[#1e293b] bg-[#1e293b] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                2
              </span>
              L&apos;offre d&apos;emploi
            </h2>
            <OffreInput
              value={formState.offre}
              onChange={handleOffreChange}
              error={formState.erreurOffre}
            />
          </div>

          {/* Erreur globale (hors crédits) */}
          {erreurGlobale && !creditsBloques && etat === "error" && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300">
                  Erreur lors de l&apos;analyse
                </p>
                <p className="mt-1 text-sm text-red-300/80">{erreurGlobale}</p>
              </div>
            </div>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "w-full rounded-xl py-4 text-base font-semibold transition-all duration-200",
              "flex items-center justify-center gap-3",
              canSubmit
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-400 hover:shadow-blue-400/30 hover:scale-[1.01] active:scale-100"
                : "bg-[#1e293b] text-[#475569] cursor-not-allowed border border-[#334155]"
            )}
          >
            {etat === "loading" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyse en cours…
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                Analyser mon CV
              </>
            )}
          </button>

          {/* Indication de ce qui se passe */}
          {etat === "loading" && (
            <div className="text-center space-y-1">
              <p className="text-xs text-[#94a3b8]">
                Extraction du texte → Analyse IA → Calcul du score
              </p>
              <p className="text-xs text-[#475569]">
                Environ 15-30 secondes selon la complexité
              </p>
            </div>
          )}
        </form>

        {/* Résultats */}
        {etat === "success" && resultat && (
          <div id="resultats" className="mt-10 animate-slide-up">
            {/* Séparateur avec bouton reset */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Résultats de l&apos;analyse</h2>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#334155] bg-[#1e293b] px-3 py-1.5 text-xs font-medium text-[#94a3b8] hover:text-white hover:border-[#475569] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Nouvelle analyse
              </button>
            </div>

            <ScoreResult result={resultat} cvFileName={formState.cv?.name ?? "CV"} />
          </div>
        )}
      </div>
    </div>
  )
}
