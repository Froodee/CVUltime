export interface KeywordsResult {
  presents: string[]
  manquants: string[]
  taux_matching: number
}

export interface SectionResult {
  present: boolean
  score: number
  problemes: string[]
}

export interface ProblemeCritique {
  type: "parsing" | "keywords" | "structure" | "contenu"
  description: string
  priorite: "haute" | "moyenne" | "faible"
}

export interface Recommandation {
  section: string
  probleme: string
  solution: string
  impact: "fort" | "moyen" | "faible"
}

export interface AnalyseResult {
  score_global: number
  score_parsing: number
  score_keywords: number
  score_contenu: number
  score_structure: number
  matching_offre: number
  keywords: KeywordsResult
  sections: {
    contact: SectionResult
    accroche: SectionResult
    experiences: SectionResult
    formation: SectionResult
    competences: SectionResult
    langues: SectionResult
  }
  problemes_critiques: ProblemeCritique[]
  recommandations: Recommandation[]
  points_forts: string[]
  resume_general: string
}

export interface AnalyseApiResponse {
  success: boolean
  data?: AnalyseResult
  error?: string
  code?: string
}
