import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 — Page introuvable | CVUltime",
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-[#0f172a] px-4 text-center">
      {/* Code d'erreur stylisé */}
      <p className="text-8xl font-black text-[#1e293b] sm:text-9xl select-none">
        404
      </p>

      {/* Titre principal */}
      <h1 className="mt-4 text-2xl font-black text-white sm:text-3xl">
        Cette page n&apos;existe pas.
      </h1>

      {/* Sous-titre cynique, dans le ton du projet */}
      <p className="mt-3 text-[#64748b] text-base sm:text-lg max-w-sm">
        Comme ton CV dans la pile ATS.
      </p>

      {/* Séparateur décoratif */}
      <div className="mt-8 h-px w-16 bg-[#334155]" />

      {/* Bouton retour */}
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-400 transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
