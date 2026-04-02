import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog — CVUltime",
  description:
    "Conseils ATS, optimisation CV, décryptage du recrutement. Tout ce que les RH ne te diront pas en face.",
}

interface Article {
  slug: string
  titre: string
  description: string
  date: string
  tag: string
}

// Articles hardcodés — pas de CMS pour l'instant
const articles: Article[] = [
  {
    slug: "pourquoi-mon-cv-ne-fonctionne-pas",
    titre: "Pourquoi ton CV ne fonctionne pas (et ce n'est pas ta faute)",
    description:
      "Les systèmes ATS rejettent 75% des CVs avant qu'un humain les lise. Voici comment ils fonctionnent et comment en sortir vivant.",
    date: "2025-03-15",
    tag: "ATS",
  },
  {
    slug: "mots-cles-cv-guide-complet",
    titre: "Le guide des mots-clés CV : comment les choisir et les placer",
    description:
      "Un mot-clé absent, c'est une candidature fantôme. On t'explique comment identifier ceux qui comptent vraiment.",
    date: "2025-03-10",
    tag: "Mots-clés",
  },
  {
    slug: "format-cv-ats-compatible",
    titre: "Format CV : ce que les ATS peuvent (et ne peuvent pas) lire",
    description:
      "Colonnes, tableaux, graphiques... tout ce qui semble beau à l'œil peut être illisible pour un ATS. Guide pratique.",
    date: "2025-03-05",
    tag: "Format",
  },
  {
    slug: "lettre-motivation-inutile",
    titre: "La lettre de motivation est-elle vraiment inutile en 2025 ?",
    description:
      "Spoiler : ça dépend. On démêle le vrai du faux sur la lettre de motivation à l'ère de l'IA et du recrutement automatisé.",
    date: "2025-02-28",
    tag: "Conseils",
  },
  {
    slug: "linkedin-cv-differences",
    titre: "LinkedIn vs CV : les différences que tu rates probablement",
    description:
      "Ton LinkedIn et ton CV ne sont pas interchangeables. Voici comment les optimiser différemment pour maximiser tes chances.",
    date: "2025-02-20",
    tag: "LinkedIn",
  },
]

// Formate une date ISO en français (ex : "15 mars 2025")
function formaterDate(dateIso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateIso))
}

// Couleur du badge selon le tag
function couleurTag(tag: string): string {
  const map: Record<string, string> = {
    ATS: "border-blue-500/30 bg-blue-500/10 text-blue-300",
    "Mots-clés": "border-green-500/30 bg-green-500/10 text-green-300",
    Format: "border-orange-500/30 bg-orange-500/10 text-orange-300",
    Conseils: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    LinkedIn: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  }
  return map[tag] ?? "border-[#334155] bg-[#1e293b] text-[#94a3b8]"
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* En-tête */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Le Blog CVUltime
          </h1>
          <p className="mt-3 text-[#94a3b8] max-w-xl">
            Ce que les RH ne te disent pas. L&apos;ATS expliqué sans bullshit.
          </p>
        </div>

        {/* Liste des articles */}
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/blog/${article.slug}`}
                className="group block rounded-xl border border-[#334155] bg-[#1e293b] p-6 transition-colors hover:border-[#475569] hover:bg-[#243247]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  {/* Tag */}
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${couleurTag(article.tag)}`}
                  >
                    {article.tag}
                  </span>
                  {/* Date */}
                  <time
                    dateTime={article.date}
                    className="text-xs text-[#475569]"
                  >
                    {formaterDate(article.date)}
                  </time>
                </div>

                <h2 className="mt-3 text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {article.titre}
                </h2>
                <p className="mt-2 text-sm text-[#64748b] leading-relaxed">
                  {article.description}
                </p>

                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-blue-400 group-hover:gap-2 transition-all">
                  Lire l&apos;article
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
