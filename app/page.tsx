import Link from "next/link"
import { Zap, Search, FileCheck, ArrowRight, ShieldCheck, Clock, Target } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CVUltime — Ton CV passe-t-il les filtres ATS ?",
}

// Fonctionnalités principales
const features = [
  {
    icon: Search,
    titre: "Analyse des mots-clés",
    description:
      "Compare les mots-clés de ton CV avec l'offre d'emploi. Identifie exactement ce qui manque pour passer le filtre automatique.",
  },
  {
    icon: FileCheck,
    titre: "Compatibilité ATS",
    description:
      "Vérifie que ton CV est correctement parsé par les systèmes ATS. Structure, sections, format — tout est analysé.",
  },
  {
    icon: Zap,
    titre: "Recommandations IA",
    description:
      "Reçois des recommandations concrètes et actionnables pour améliorer ton score et maximiser tes chances d'entretien.",
  },
]

// Arguments de réassurance
const reassurances = [
  {
    icon: Clock,
    texte: "Analyse en moins de 30 secondes",
  },
  {
    icon: ShieldCheck,
    texte: "Ton CV n'est jamais stocké sur nos serveurs",
  },
  {
    icon: Target,
    texte: "Score détaillé sur 100",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center">
        {/* Halo lumineux décoratif */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-blue-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-medium text-blue-300">
              Propulsé par Mistral AI · Gratuit pour commencer
            </span>
          </div>

          {/* Titre principal */}
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Ton CV est parfait.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Personne ne le lit.
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="mx-auto mt-6 max-w-2xl text-base text-[#94a3b8] sm:text-lg leading-relaxed">
            75% des CVs sont rejetés par les systèmes ATS avant même d&apos;atteindre un recruteur.
            Analyse le tien en quelques secondes et corrige ce qui bloque ta candidature.
          </p>

          {/* CTA principal */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/analyse"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-400 hover:shadow-blue-400/30 hover:scale-105 active:scale-100"
            >
              Analyser mon CV gratuitement
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-xs text-[#475569]">
              Aucune inscription requise · Résultat immédiat
            </p>
          </div>

          {/* Réassurances */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {reassurances.map(({ icon: Icon, texte }) => (
              <div
                key={texte}
                className="flex items-center gap-2 rounded-full border border-[#1e293b] bg-[#1e293b] px-4 py-2"
              >
                <Icon className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                <span className="text-xs text-[#94a3b8]">{texte}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explication du problème ATS */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-[#334155] bg-[#1e293b] p-8 sm:p-10">
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
              Qu&apos;est-ce qu&apos;un ATS ?
            </h2>
            <div className="space-y-4 text-[#94a3b8] leading-relaxed">
              <p>
                Un <strong className="text-white">ATS (Applicant Tracking System)</strong> est
                un logiciel utilisé par les entreprises pour trier automatiquement les candidatures
                reçues. Avant qu&apos;un recruteur pose les yeux sur ton CV, l&apos;ATS l&apos;a
                déjà scanné, noté, et probablement rejeté.
              </p>
              <p>
                Ces systèmes cherchent des{" "}
                <strong className="text-white">mots-clés spécifiques</strong> présents dans
                l&apos;offre d&apos;emploi : compétences, technologies, diplômes, titres de poste.
                Si ton CV utilise des synonymes, un format non standard, ou manque de termes clés,
                tu es éliminé automatiquement.
              </p>
              <p>
                <strong className="text-white">CVUltime</strong> analyse ton CV comme le ferait
                un ATS : extraction du texte, détection des sections, correspondance des mots-clés,
                et te donne un score précis avec des recommandations pour maximiser tes chances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Tout ce qu&apos;il faut pour décrocher l&apos;entretien
            </h2>
            <p className="mt-3 text-[#94a3b8]">
              Une analyse complète en trois dimensions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, titre, description }) => (
              <div
                key={titre}
                className="group rounded-xl border border-[#334155] bg-[#1e293b] p-6 transition-all hover:border-blue-500/40 hover:bg-[#1e293b]/80"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-white">{titre}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 h-[200px] w-[400px] rounded-full bg-blue-500/5 blur-3xl"
          />
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Prêt à remettre ton CV en forme ?
          </h2>
          <p className="mt-3 text-[#94a3b8]">
            Upload ton CV, colle l&apos;offre d&apos;emploi, et obtiens ton analyse en 30 secondes.
          </p>
          <Link
            href="/analyse"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-400 hover:scale-105 active:scale-100"
          >
            Commencer l&apos;analyse
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
