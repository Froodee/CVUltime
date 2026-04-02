import { Mistral } from "@mistralai/mistralai"
import { AnalyseResult } from "@/types/analyse"

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!,
})

const SYSTEM_PROMPT = `Tu es un expert en recrutement et en systèmes ATS (Applicant Tracking Systems).
Tu analyses les CVs et les offres d'emploi pour identifier les problèmes de compatibilité ATS.

RÈGLE PRIORITAIRE : Avant toute analyse, vérifie que le texte de l'offre d'emploi est bien une vraie offre.
Une vraie offre d'emploi contient au moins : un intitulé de poste, des missions ou responsabilités, et/ou des compétences requises.
Si le texte de l'offre est du charabia, du texte aléatoire, une phrase sans sens, ou n'a rien à voir avec un emploi,
retourne UNIQUEMENT ce JSON sans rien d'autre :
{"erreur": "Le texte fourni ne ressemble pas à une offre d'emploi. Colle le texte complet d'une vraie offre (intitulé du poste, missions, compétences requises, etc.)."}

Sinon, retourne UNIQUEMENT un JSON valide d'analyse, sans markdown, sans backticks, sans texte avant ou après.`

function buildUserPrompt(cvText: string, jobText: string): string {
  return `Analyse ce CV par rapport à cette offre d'emploi.

Si l'offre n'est pas une vraie offre d'emploi, retourne uniquement {"erreur": "..."}.

Sinon retourne UNIQUEMENT un JSON valide avec cette structure :
{
  "score_global": <0-100>,
  "score_parsing": <0-100>,
  "score_keywords": <0-100>,
  "score_contenu": <0-100>,
  "score_structure": <0-100>,
  "matching_offre": <0-100>,
  "keywords": {
    "presents": ["keyword1", "keyword2"],
    "manquants": ["keyword1", "keyword2"],
    "taux_matching": <0-100>
  },
  "sections": {
    "contact": { "present": true, "score": <0-100>, "problemes": [] },
    "accroche": { "present": true, "score": <0-100>, "problemes": [] },
    "experiences": { "present": true, "score": <0-100>, "problemes": [] },
    "formation": { "present": true, "score": <0-100>, "problemes": [] },
    "competences": { "present": true, "score": <0-100>, "problemes": [] },
    "langues": { "present": true, "score": <0-100>, "problemes": [] }
  },
  "problemes_critiques": [
    { "type": "parsing|keywords|structure|contenu", "description": "...", "priorite": "haute|moyenne|faible" }
  ],
  "recommandations": [
    { "section": "...", "probleme": "...", "solution": "...", "impact": "fort|moyen|faible" }
  ],
  "points_forts": ["...", "..."],
  "resume_general": "2-3 phrases résumant l'analyse en français, personnalisées par rapport au poste visé"
}

CV :
${cvText}

OFFRE D'EMPLOI :
${jobText}`
}

// Type intermédiaire pour détecter la réponse d'erreur Mistral
type MistralResponse = AnalyseResult | { erreur: string }

export async function analyserCV(
  cvText: string,
  jobText: string
): Promise<AnalyseResult> {
  const response = await client.chat.complete({
    model: "mistral-small-latest",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(cvText, jobText) },
    ],
    temperature: 0.1,
    maxTokens: 4000,
  })

  const content = response.choices?.[0]?.message?.content
  if (!content || typeof content !== "string") {
    throw new Error("Réponse Mistral vide ou invalide")
  }

  // Nettoyage au cas où Mistral ajouterait des backticks malgré les instructions
  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  let parsed: MistralResponse
  try {
    parsed = JSON.parse(cleaned) as MistralResponse
  } catch {
    throw new Error(`Réponse Mistral non-JSON : ${cleaned.slice(0, 200)}`)
  }

  // Mistral a détecté que l'offre n'est pas valide → on remonte l'erreur proprement
  if ("erreur" in parsed) {
    throw new Error(parsed.erreur)
  }

  return parsed
}
