import { CheckCircle2, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Paiement confirmé — CVUltime",
}

export default function PaiementSuccesPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">

        {/* Icône succès */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white">Paiement confirmé !</h1>
        <p className="mt-3 text-[#94a3b8]">
          Ton crédit a bien été ajouté à ton compte. Tu peux maintenant lancer une nouvelle analyse.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/analyse"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3.5 text-base font-semibold text-white hover:bg-blue-400 transition-colors"
          >
            <Zap className="h-5 w-5" />
            Analyser mon CV
          </Link>
          <Link
            href="/rewrite"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#334155] bg-[#1e293b] px-6 py-3.5 text-base font-medium text-[#94a3b8] hover:text-white hover:border-[#475569] transition-colors"
          >
            Réécrire mon CV
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
