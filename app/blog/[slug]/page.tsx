import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Contenu des articles disponibles
interface ArticleComplet {
  slug: string
  titre: string
  description: string
  date: string
  tag: string
  contenu: React.ReactNode
}

// Formate une date ISO en français
function formaterDate(dateIso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateIso))
}

// Contenu complet de l'article vedette
const articleVedette: ArticleComplet = {
  slug: "pourquoi-mon-cv-ne-fonctionne-pas",
  titre: "Pourquoi ton CV ne fonctionne pas (et ce n'est pas ta faute)",
  description:
    "Les systèmes ATS rejettent 75% des CVs avant qu'un humain les lise. Voici comment ils fonctionnent et comment en sortir vivant.",
  date: "2025-03-15",
  tag: "ATS",
  contenu: (
    <div className="prose-custom space-y-6">
      <p>
        Tu postules depuis des semaines. Tu personnalises chaque candidature. Et pourtant, le silence radio.
        Pas d&apos;entretien, pas de retour, rien. Avant de remettre en question ta valeur professionnelle,
        voici une réalité que peu de candidats connaissent : <strong>la plupart des entreprises utilisent
        des logiciels ATS (Applicant Tracking Systems)</strong> qui trient automatiquement les CVs avant
        qu&apos;un seul regard humain ne se pose dessus.
      </p>

      <h2>Comment fonctionne un ATS ?</h2>
      <p>
        Un ATS est un logiciel de gestion des candidatures. Son rôle premier est d&apos;organiser les
        candidatures reçues, mais il intègre aussi des filtres automatiques : si ton CV ne contient pas
        les mots-clés attendus ou si sa mise en forme empêche la lecture automatique, il est écarté
        avant même d&apos;atteindre un recruteur.
      </p>
      <p>
        Les erreurs les plus courantes sont les tableaux en colonnes (que beaucoup d&apos;ATS ne savent
        pas lire dans l&apos;ordre), les sections avec des titres non standards (« Ma vie » au lieu de
        « Expériences »), et l&apos;absence pure et simple des mots-clés présents dans l&apos;offre
        d&apos;emploi.
      </p>

      <h2>Ce que tu peux faire dès maintenant</h2>
      <p>
        La bonne nouvelle, c&apos;est que le problème est technique, pas humain. Un CV optimisé ATS
        respecte une structure simple : des sections clairement nommées, un format texte lisible
        (pas de graphiques, pas de colonnes complexes), et des mots-clés tirés directement de l&apos;offre.
        C&apos;est exactement ce qu&apos;une analyse CVUltime mesure et ce que notre outil de réécriture
        optimise automatiquement.
      </p>
    </div>
  ),
}

// Métadonnées des autres articles (titre + description pour les stubs)
const autresArticles: Record<string, { titre: string; description: string; date: string; tag: string }> = {
  "mots-cles-cv-guide-complet": {
    titre: "Le guide des mots-clés CV : comment les choisir et les placer",
    description: "Un mot-clé absent, c'est une candidature fantôme.",
    date: "2025-03-10",
    tag: "Mots-clés",
  },
  "format-cv-ats-compatible": {
    titre: "Format CV : ce que les ATS peuvent (et ne peuvent pas) lire",
    description: "Colonnes, tableaux, graphiques... tout ce qui semble beau peut être illisible.",
    date: "2025-03-05",
    tag: "Format",
  },
  "lettre-motivation-inutile": {
    titre: "La lettre de motivation est-elle vraiment inutile en 2025 ?",
    description: "Spoiler : ça dépend.",
    date: "2025-02-28",
    tag: "Conseils",
  },
  "linkedin-cv-differences": {
    titre: "LinkedIn vs CV : les différences que tu rates probablement",
    description: "Ton LinkedIn et ton CV ne sont pas interchangeables.",
    date: "2025-02-20",
    tag: "LinkedIn",
  },
}

// Tous les slugs connus (pour la vérification 404)
const tousSlugs = new Set([
  articleVedette.slug,
  ...Object.keys(autresArticles),
])

// Génération des métadonnées SEO dynamiques
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  if (slug === articleVedette.slug) {
    return {
      title: articleVedette.titre,
      description: articleVedette.description,
      openGraph: {
        title: articleVedette.titre,
        description: articleVedette.description,
        type: "article",
        locale: "fr_FR",
      },
    }
  }

  const article = autresArticles[slug]
  if (article) {
    return {
      title: article.titre,
      description: article.description,
    }
  }

  return {
    title: "Article introuvable — CVUltime",
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // 404 pour les slugs totalement inconnus
  if (!tousSlugs.has(slug)) {
    notFound()
  }

  // Article principal complet
  if (slug === articleVedette.slug) {
    return (
      <div className="min-h-screen bg-[#0f172a] px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Fil d'ariane */}
          <nav className="mb-8 flex items-center gap-2 text-xs text-[#475569]">
            <Link href="/" className="hover:text-[#94a3b8] transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#94a3b8] transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-[#64748b] truncate">{articleVedette.titre}</span>
          </nav>

          {/* En-tête article */}
          <header className="mb-8">
            <span className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-300">
              {articleVedette.tag}
            </span>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl leading-tight">
              {articleVedette.titre}
            </h1>
            <p className="mt-3 text-sm text-[#64748b]">
              Publié le{" "}
              <time dateTime={articleVedette.date}>
                {formaterDate(articleVedette.date)}
              </time>
            </p>
          </header>

          {/* Corps de l'article */}
          <article className="rounded-xl border border-[#334155] bg-[#1e293b] p-6 sm:p-8 text-[#cbd5e1] text-sm leading-relaxed space-y-4 [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_strong]:text-white">
            {articleVedette.contenu}
          </article>

          {/* CTA */}
          <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">
            <p className="text-sm font-medium text-white">
              Vérifie ton score ATS maintenant
            </p>
            <p className="mt-1 text-xs text-[#64748b]">
              Gratuit, aucune inscription requise.
            </p>
            <Link
              href="/analyse"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-400 transition-colors"
            >
              Analyser mon CV
            </Link>
          </div>

          {/* Retour au blog */}
          <div className="mt-6 text-center">
            <Link
              href="/blog"
              className="text-xs text-[#475569] hover:text-[#94a3b8] transition-colors"
            >
              ← Retour au blog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Stub pour les autres articles
  const article = autresArticles[slug]!
  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Fil d'ariane */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-[#475569]">
          <Link href="/" className="hover:text-[#94a3b8] transition-colors">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#94a3b8] transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[#64748b] truncate">{article.titre}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-black text-white sm:text-3xl leading-tight">
            {article.titre}
          </h1>
          <p className="mt-3 text-sm text-[#64748b]">
            Publié le{" "}
            <time dateTime={article.date}>{formaterDate(article.date)}</time>
          </p>
        </header>

        {/* Contenu en cours de rédaction */}
        <div className="rounded-xl border border-[#334155] bg-[#1e293b] p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0f172a]">
            <span className="text-2xl">✍️</span>
          </div>
          <p className="text-sm font-medium text-white">
            Article en cours de rédaction
          </p>
          <p className="mt-2 text-xs text-[#64748b]">
            Reviens dans quelques jours, on y travaille.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="text-xs text-[#475569] hover:text-[#94a3b8] transition-colors"
          >
            ← Retour au blog
          </Link>
        </div>
      </div>
    </div>
  )
}
