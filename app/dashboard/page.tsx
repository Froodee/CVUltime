import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ArrowRight, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import type { Analyse } from "@prisma/client"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Dashboard — CVUltime",
}

// Renvoie une couleur de badge selon le score global
function couleurScore(score: number): { bg: string; text: string; label: string } {
  if (score >= 75) return { bg: "bg-green-500/15 border-green-500/30", text: "text-green-400", label: "Excellent" }
  if (score >= 50) return { bg: "bg-blue-500/15 border-blue-500/30", text: "text-blue-400", label: "Correct" }
  if (score >= 30) return { bg: "bg-orange-500/15 border-orange-500/30", text: "text-orange-400", label: "Faible" }
  return { bg: "bg-red-500/15 border-red-500/30", text: "text-red-400", label: "Critique" }
}

// Formate une date en français (ex : "3 mars 2025 à 14h32")
function formaterDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default async function DashboardPage() {
  // Vérification de l'authentification
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    redirect("/")
  }

  const user = await currentUser()
  const prenom = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "toi"

  // Récupération de l'utilisateur en DB via son clerkId
  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
  })

  // Récupération des analyses si l'utilisateur existe en DB
  const analyses = dbUser
    ? await prisma.analyse.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
      })
    : []

  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* En-tête */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Bonjour, {prenom} 👋
          </h1>
          <p className="mt-2 text-[#94a3b8]">
            Bienvenue sur ton tableau de bord CVUltime.
          </p>
        </div>

        {/* Section historique */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">
              Historique de tes analyses
            </h2>
            <span className="text-sm text-[#475569]">
              ({analyses.length} analyse{analyses.length !== 1 ? "s" : ""})
            </span>
          </div>

          {analyses.length === 0 ? (
            /* Aucune analyse — CTA */
            <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0f172a]">
                <FileText className="h-7 w-7 text-[#475569]" />
              </div>
              <p className="text-base font-medium text-white">
                Aucune analyse pour le moment
              </p>
              <p className="mt-2 text-sm text-[#64748b]">
                Lance ta première analyse ATS pour voir les résultats ici.
              </p>
              <Link
                href="/analyse"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 transition-colors"
              >
                Analyser un CV
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* Liste des analyses */
            <ul className="space-y-3">
              {analyses.map((analyse: Analyse) => {
                const { bg, text, label } = couleurScore(analyse.scoreGlobal)
                return (
                  <li
                    key={analyse.id}
                    className="rounded-xl border border-[#334155] bg-[#1e293b] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {/* Infos principales */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0f172a]">
                          <FileText className="h-5 w-5 text-[#475569]" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {analyse.cvFileName}
                          </p>
                          <p className="mt-0.5 text-xs text-[#64748b]">
                            {formaterDate(analyse.createdAt)}
                          </p>
                        </div>
                      </div>

                      {/* Droite : score + bouton */}
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Badge score */}
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${bg} ${text}`}
                        >
                          <span className="tabular-nums">{analyse.scoreGlobal}/100</span>
                          <span className="text-xs font-normal opacity-75">— {label}</span>
                        </span>

                        {/* Bouton détails (désactivé pour l'instant) */}
                        <button
                          type="button"
                          disabled
                          title="Détails bientôt disponibles"
                          className="rounded-lg border border-[#334155] bg-[#0f172a] px-3 py-1.5 text-xs font-medium text-[#475569] cursor-not-allowed opacity-50"
                        >
                          Voir les détails
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* CTA : lancer une nouvelle analyse */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                Prêt à analyser un nouveau CV ?
              </h3>
              <p className="mt-1 text-sm text-[#94a3b8]">
                Lance une analyse en moins de 30 secondes.
              </p>
            </div>
            <Link
              href="/analyse"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 transition-colors"
            >
              Analyser un CV
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
