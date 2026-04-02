"use client"

import { AnalyseResult } from "@/types/analyse"
import { ScoreGauge } from "@/components/score-gauge"
import { KeywordsDiff } from "@/components/keywords-diff"
import { RecommendationsList } from "@/components/recommendations-list"
import {
  cn,
  getScoreColor,
  getScoreHex,
  getPriorite,
} from "@/lib/utils"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Globe,
  BookOpen,
  BarChart3,
} from "lucide-react"

interface ScoreResultProps {
  result: AnalyseResult
  cvFileName: string
}

// Configuration des icônes de section
const SECTION_CONFIG = {
  contact: { label: "Contact", icon: User },
  accroche: { label: "Accroche", icon: FileText },
  experiences: { label: "Expériences", icon: Briefcase },
  formation: { label: "Formation", icon: GraduationCap },
  competences: { label: "Compétences", icon: Code2 },
  langues: { label: "Langues", icon: Globe },
} as const

type SectionKey = keyof typeof SECTION_CONFIG

export function ScoreResult({ result, cvFileName }: ScoreResultProps) {
  const {
    score_global,
    score_parsing,
    score_keywords,
    score_contenu,
    score_structure,
    matching_offre,
    keywords,
    sections,
    problemes_critiques,
    recommandations,
    points_forts,
    resume_general,
  } = result

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* En-tête : fichier analysé */}
      <div className="flex items-center gap-2 rounded-xl border border-[#475569] bg-[#1e293b] px-4 py-3">
        <FileText className="h-4 w-4 text-blue-400 shrink-0" />
        <span className="text-sm text-[#94a3b8]">Analyse pour :</span>
        <span className="text-sm font-medium text-white truncate">{cvFileName}</span>
      </div>

      {/* Section 1 : Score global */}
      <div className="rounded-xl border border-[#475569] bg-[#1e293b] p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          {/* Jauge principale */}
          <div className="shrink-0">
            <ScoreGauge score={score_global} label="Score ATS global" size="lg" />
          </div>

          {/* Scores détaillés */}
          <div className="flex-1 w-full">
            <h3 className="mb-4 text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              Scores détaillés
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Parsing", score: score_parsing },
                { label: "Mots-clés", score: score_keywords },
                { label: "Contenu", score: score_contenu },
                { label: "Structure", score: score_structure },
                { label: "Matching offre", score: matching_offre },
              ].map(({ label, score }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1 rounded-lg bg-[#0f172a] p-3"
                >
                  <ScoreGauge score={score} size="sm" showLabel={false} />
                  <span className="text-xs text-[#94a3b8] text-center">{label}</span>
                  <span
                    className={cn("text-xs font-bold", getScoreColor(score))}
                  >
                    {score}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 : Résumé général */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
        <p className="text-sm text-[#cbd5e1] leading-relaxed">
          <span className="font-semibold text-blue-400">Résumé : </span>
          {resume_general}
        </p>
      </div>

      {/* Section 3 : Points forts */}
      {points_forts.length > 0 && (
        <div className="rounded-xl border border-[#475569] bg-[#1e293b] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Star className="h-4 w-4 text-yellow-400" />
            Points forts ({points_forts.length})
          </h3>
          <ul className="space-y-2">
            {points_forts.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                <span className="text-sm text-[#cbd5e1]">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 4 : Analyse des mots-clés */}
      <KeywordsDiff keywords={keywords} />

      {/* Section 5 : Sections du CV */}
      <div className="rounded-xl border border-[#475569] bg-[#1e293b] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">
          Analyse des sections
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(Object.keys(SECTION_CONFIG) as SectionKey[]).map((key) => {
            const { label, icon: Icon } = SECTION_CONFIG[key]
            const section = sections[key]

            return (
              <div
                key={key}
                className={cn(
                  "rounded-lg border p-3 transition-colors",
                  section.present
                    ? "border-[#334155] bg-[#0f172a]"
                    : "border-red-500/20 bg-red-500/5"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Icône + présence */}
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      section.present ? "bg-blue-500/10" : "bg-red-500/10"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        section.present ? "text-blue-400" : "text-red-400"
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-white">{label}</span>
                      <div className="flex items-center gap-1.5">
                        {section.present ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                        ) : (
                          <XCircle className="h-3.5 w-3.5 text-red-400" />
                        )}
                        <span
                          className={cn(
                            "text-xs font-bold tabular-nums",
                            getScoreColor(section.score)
                          )}
                          style={{ color: getScoreHex(section.score) }}
                        >
                          {section.score}/100
                        </span>
                      </div>
                    </div>

                    {/* Barre de score */}
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#1e293b] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${section.score}%`,
                          backgroundColor: getScoreHex(section.score),
                        }}
                      />
                    </div>

                    {/* Problèmes de la section */}
                    {section.problemes.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {section.problemes.map((probleme, i) => (
                          <li
                            key={i}
                            className="text-xs text-[#94a3b8] flex items-start gap-1"
                          >
                            <span className="text-orange-400 mt-0.5">•</span>
                            {probleme}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 6 : Problèmes critiques */}
      {problemes_critiques.length > 0 && (
        <div className="rounded-xl border border-[#475569] bg-[#1e293b] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            Problèmes critiques ({problemes_critiques.length})
          </h3>
          <div className="space-y-2">
            {problemes_critiques.map((probleme, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3",
                  getPriorite(probleme.priorite)
                )}
              >
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                      {probleme.type}
                    </span>
                    <span
                      className={cn(
                        "rounded-full border px-1.5 py-0.5 text-xs font-medium",
                        getPriorite(probleme.priorite)
                      )}
                    >
                      {probleme.priorite}
                    </span>
                  </div>
                  <p className="text-sm opacity-90">{probleme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 7 : Recommandations */}
      <RecommendationsList recommandations={recommandations} />
    </div>
  )
}
