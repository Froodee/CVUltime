"use client"

import { useState, useCallback, useRef } from "react"
import { UploadCv } from "@/components/upload-cv"
import { OffreInput } from "@/components/offre-input"
import { cn } from "@/lib/utils"
import { Loader2, Sparkles, AlertCircle, Lock, Download, FileText, Mail, Phone, MapPin, Link } from "lucide-react"
import { BoutonAchat } from "@/components/bouton-achat"
import { telechargerPdf } from "@/lib/export-pdf"
import type { CvStructure } from "@/lib/mistral-rewrite"

type EtatRewrite = "idle" | "loading" | "success" | "error"

interface EtatFormulaire {
  cv: File | null
  offre: string
  erreurOffre: string
}

interface RewriteApiResponse {
  success?: boolean
  error?: string
  code?: string
  data?: { cvReecrit: CvStructure }
}

// Icône pour les lignes de contact
function iconeContact(ligne: string) {
  if (ligne.includes("@")) return <Mail className="h-3 w-3 shrink-0" />
  if (ligne.match(/^[\d\s\+\(\)\.]+$/)) return <Phone className="h-3 w-3 shrink-0" />
  if (ligne.toLowerCase().includes("linkedin")) return <Link className="h-3 w-3 shrink-0" />
  return <MapPin className="h-3 w-3 shrink-0" />
}

// Prévisualisation 2 colonnes du CV
function PreviewCV({ cv, nomFichier, contentRef }: { cv: CvStructure; nomFichier: string; contentRef?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="rounded-xl border border-[#334155] overflow-hidden shadow-xl">
      {/* Barre du document */}
      <div className="flex items-center justify-between border-b border-[#334155] bg-[#0f172a] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-400" />
          <span className="text-xs font-medium text-white">
            {nomFichier.replace(/\.(pdf|docx)$/i, "") + "_optimise.pdf"}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          1 page · Optimisé ATS
        </span>
      </div>

      {/* Document en 2 colonnes — proportions A4 (210/297) */}
      <div ref={contentRef} className="flex aspect-[210/297]">

        {/* Colonne gauche — fond bleu foncé */}
        <div className="w-[35%] shrink-0 bg-[#1e3a8a] p-5 flex flex-col gap-4">

          {/* Nom + titre */}
          <div>
            <h2 className="text-lg font-black text-white leading-tight">{cv.nom}</h2>
            <p className="mt-1 text-xs text-blue-200 italic">{cv.titre}</p>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-300 border-b border-blue-700 pb-1">Contact</p>
            <div className="flex flex-col gap-1.5">
              {cv.contact.map((ligne, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-300 mt-0.5">{iconeContact(ligne)}</span>
                  <span className="text-[10px] text-blue-100 break-all leading-snug">{ligne}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compétences */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-300 border-b border-blue-700 pb-1">Compétences</p>
            <div className="flex flex-col gap-1">
              {cv.competences.map((comp, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-blue-400 shrink-0" />
                  <span className="text-[10px] text-blue-100">{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Langues */}
          {cv.langues.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-300 border-b border-blue-700 pb-1">Langues</p>
              <div className="flex flex-col gap-1">
                {cv.langues.map((langue, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-blue-400 shrink-0" />
                    <span className="text-[10px] text-blue-100">{langue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formation */}
          {cv.formation.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-300 border-b border-blue-700 pb-1">Formation</p>
              <div className="flex flex-col gap-2">
                {cv.formation.map((f, i) => (
                  <div key={i}>
                    <p className="text-[10px] font-semibold text-white">{f.diplome}</p>
                    <p className="text-[9px] text-blue-200">{f.etablissement} · {f.annee}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite — fond blanc */}
        <div className="flex-1 bg-white p-6 flex flex-col gap-4">

          {/* Accroche */}
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-800 border-b-2 border-blue-700 pb-1">Profil</p>
            <p className="text-[10px] text-gray-700 leading-relaxed">{cv.accroche}</p>
          </div>

          {/* Expériences */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-800 border-b-2 border-blue-700 pb-1">Expériences</p>
            <div className="flex flex-col gap-3">
              {cv.experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <p className="text-[10px] font-bold text-gray-900">{exp.poste}</p>
                    <p className="text-[9px] text-gray-500 shrink-0">{exp.periode}</p>
                  </div>
                  <p className="text-[9px] text-blue-700 font-medium mb-1">{exp.entreprise}</p>
                  <div className="flex flex-col gap-0.5">
                    {exp.bullets.map((b, j) => (
                      <div key={j} className="flex items-start gap-1.5">
                        <span className="text-blue-600 font-bold text-[10px] shrink-0 mt-px">—</span>
                        <span className="text-[9px] text-gray-700 leading-snug">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Paragraphe mots-clés — titre discret, phrases naturelles */}
          {cv.paragrapheMotsCles && (
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-800 border-b-2 border-blue-700 pb-1">Domaines d&apos;expertise</p>
              <p className="text-[9px] text-gray-600 leading-relaxed italic">{cv.paragrapheMotsCles}</p>
            </div>
          )}
        </div>
      </div>

      <p className="bg-[#0f172a] px-4 py-2 text-[10px] text-[#475569] text-center">
        Aperçu — le PDF téléchargé aura exactement cette mise en page
      </p>
    </div>
  )
}

export default function RewritePage() {
  const [formState, setFormState] = useState<EtatFormulaire>({
    cv: null,
    offre: "",
    erreurOffre: "",
  })
  const [etat, setEtat] = useState<EtatRewrite>("idle")
  const [cvReecrit, setCvReecrit] = useState<CvStructure | null>(null)
  const [erreurGlobale, setErreurGlobale] = useState<string>("")
  const [creditsBloques, setCreditsBloques] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = useCallback((file: File | null) => {
    setFormState((prev) => ({ ...prev, cv: file }))
    if (cvReecrit) {
      setCvReecrit(null)
      setEtat("idle")
    }
  }, [cvReecrit])

  const handleOffreChange = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, offre: value, erreurOffre: "" }))
  }, [])

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
    setCvReecrit(null)

    try {
      const form = new FormData()
      form.append("cv", formState.cv!)
      form.append("offre", formState.offre.trim())

      const res = await fetch("/api/rewrite", { method: "POST", body: form })
      const json = (await res.json()) as RewriteApiResponse

      if (!res.ok || !json.success) {
        if (res.status === 402 || json.code === "NO_CREDITS") {
          setCreditsBloques(true)
          setErreurGlobale(json.error ?? "Réécriture non disponible.")
          setEtat("error")
          return
        }
        throw new Error(json.error ?? `Erreur serveur (${res.status})`)
      }

      if (!json.data?.cvReecrit) throw new Error("Réponse invalide du serveur.")

      setCvReecrit(json.data.cvReecrit)
      setEtat("success")

      setTimeout(() => {
        document.getElementById("resultat-rewrite")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    } catch (err) {
      setErreurGlobale(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.")
      setEtat("error")
    }
  }

  const canSubmit = !creditsBloques && etat !== "loading" && !!formState.cv && formState.offre.trim().length >= 50

  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black text-white sm:text-4xl">Réécriture CV optimisée</h1>
            <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300">Bêta</span>
          </div>
          <p className="mt-3 text-[#94a3b8]">
            CV réécrit en 2 colonnes, 1 page, avec uniquement les compétences utiles pour l&apos;offre.
          </p>
        </div>

        {/* Alerte crédits */}
        {creditsBloques && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
            <Lock className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-300">Réécriture gratuite utilisée</p>
              <p className="mt-1 text-sm text-orange-300/80">{erreurGlobale}</p>
              <div className="mt-3">
                <BoutonAchat label="Acheter 1 réécriture — 1€" />
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="rounded-xl border border-[#1e293b] bg-[#1e293b] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">1</span>
              Ton CV
            </h2>
            <UploadCv onFileSelect={handleFileSelect} file={formState.cv} />
          </div>

          <div className="rounded-xl border border-[#1e293b] bg-[#1e293b] p-5">
            <h2 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">2</span>
              L&apos;offre d&apos;emploi
            </h2>
            <OffreInput value={formState.offre} onChange={handleOffreChange} error={formState.erreurOffre} />
          </div>

          {erreurGlobale && !creditsBloques && etat === "error" && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-300">Erreur lors de la réécriture</p>
                <p className="mt-1 text-sm text-red-300/80">{erreurGlobale}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              "w-full rounded-xl py-4 text-base font-semibold transition-all duration-200 flex items-center justify-center gap-3",
              canSubmit
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25 hover:bg-purple-500 hover:scale-[1.01] active:scale-100"
                : "bg-[#1e293b] text-[#475569] cursor-not-allowed border border-[#334155]"
            )}
          >
            {etat === "loading" ? <><Loader2 className="h-5 w-5 animate-spin" />Réécriture en cours…</> : <><Sparkles className="h-5 w-5" />Réécrire mon CV</>}
          </button>

          {etat === "loading" && (
            <div className="text-center space-y-1">
              <p className="text-xs text-[#94a3b8]">Extraction → Sélection du contenu → Mise en forme 2 colonnes</p>
              <p className="text-xs text-[#475569]">Environ 15-25 secondes</p>
            </div>
          )}
        </form>

        {/* Résultat */}
        {etat === "success" && cvReecrit && (
          <div id="resultat-rewrite" className="mt-10">
            <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold text-white">Ton CV réécrit</h2>
              <button
                type="button"
                disabled={isExporting}
                onClick={async () => {
                  if (!previewRef.current) return
                  setIsExporting(true)
                  await telechargerPdf(previewRef.current, formState.cv?.name ?? "cv")
                  setIsExporting(false)
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {isExporting ? "Génération…" : "Télécharger PDF"}
              </button>
            </div>

            <PreviewCV cv={cvReecrit} nomFichier={formState.cv?.name ?? "cv"} contentRef={previewRef} />
          </div>
        )}
      </div>
    </div>
  )
}
