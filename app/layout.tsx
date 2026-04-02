import type { Metadata } from "next"
import Link from "next/link"
import { ClerkProvider, SignInButton, Show, UserButton } from "@clerk/nextjs"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "CVUltime — Analyse ATS de CV",
    template: "%s | CVUltime",
  },
  description:
    "Optimise ton CV pour passer les filtres ATS. Analyse instantanée basée sur l'IA, comparaison avec l'offre d'emploi, recommandations précises.",
  keywords: [
    "ATS",
    "CV",
    "analyse",
    "recrutement",
    "optimisation",
    "mots-clés",
    "offre d'emploi",
  ],
  authors: [{ name: "CVUltime" }],
  openGraph: {
    title: "CVUltime — Analyse ATS de CV",
    description: "Ton CV est parfait. Personne ne le lit. Analyse-le maintenant.",
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className="min-h-screen bg-[#0f172a] text-white antialiased">
          {/* Navigation globale */}
          <header className="sticky top-0 z-50 border-b border-[#1e293b] bg-[#0f172a]/95 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 text-white font-bold text-lg hover:opacity-80 transition-opacity"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500 text-white text-xs font-black">
                  CV
                </span>
                <span>CVUltime</span>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-6">
                <Link
                  href="/analyse"
                  className="text-sm text-[#94a3b8] hover:text-white transition-colors hidden sm:block"
                >
                  Analyser
                </Link>
                <Link
                  href="/rewrite"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#94a3b8] hover:text-white transition-colors"
                >
                  Réécriture
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300 leading-none">
                    Bêta
                  </span>
                </Link>
                <Link
                  href="/blog"
                  className="text-sm text-[#94a3b8] hover:text-white transition-colors hidden sm:block"
                >
                  Blog
                </Link>
                <Show when="signed-in">
                  <Link
                    href="/dashboard"
                    className="text-sm text-[#94a3b8] hover:text-white transition-colors hidden sm:block"
                  >
                    Dashboard
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </Show>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="rounded-lg border border-[#334155] bg-[#1e293b] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#334155] transition-colors">
                      Connexion
                    </button>
                  </SignInButton>
                </Show>
              </nav>
            </div>
          </header>

          {/* Contenu principal */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="mt-20 border-t border-[#1e293b] py-8">
            <div className="mx-auto max-w-6xl px-4 text-center">
              <p className="text-xs text-[#475569]">
                © 2025 CVUltime — Analyse ATS propulsée par Mistral AI
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}
