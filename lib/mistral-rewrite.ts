import { Mistral } from "@mistralai/mistralai"

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!,
})

export interface CvStructure {
  // Colonne gauche
  nom: string
  titre: string
  contact: string[]
  competences: string[]
  langues: string[]
  formation: { diplome: string; etablissement: string; annee: string }[]

  // Colonne droite
  accroche: string
  experiences: {
    poste: string
    entreprise: string
    periode: string
    bullets: string[]
  }[]
  paragrapheMotsCles: string  // phrases naturelles pour remplir l'espace côté droit
}

const SYSTEM_PROMPT = `Tu es un expert en rédaction de CVs format 2 colonnes, optimisés ATS.
Tu retournes UNIQUEMENT un JSON valide, sans markdown, sans backticks, sans texte avant ou après.`

function buildUserPrompt(cvText: string, jobText: string): string {
  return `Réécris ce CV en JSON structuré pour un format 2 colonnes A4, 1 page COMPLÈTE.

OBJECTIF PRIORITAIRE : le contenu doit REMPLIR UNE PAGE A4 ENTIÈRE. Pas de blanc en bas.

RÈGLES DE DENSITÉ (applique-les toutes) :
- Garde TOUTES les compétences du CV (minimum 8-12 compétences). Mets les plus pertinentes pour l'offre en premier.
- Colonne gauche : liste toutes les compétences, toutes les langues, toute la formation.
- Colonne droite :
  * accroche : 3-4 phrases percutantes, minimum 60 mots.
  * experiences : garde toutes les expériences. Pour chaque expérience, 3-4 bullets détaillés (minimum 10 mots chacun).
  * paragrapheMotsCles : 4-6 phrases naturelles et fluides (minimum 80 mots au total) intégrant les mots-clés importants de l'offre (technologies, méthodes, soft skills). Ce paragraphe DOIT remplir l'espace restant en bas de la colonne droite.
- Tu n'inventes RIEN sur le candidat. Tu reformules et détailles ce qui existe.
- Pas d'astérisques, pas de markdown dans les valeurs.

Retourne ce JSON :
{
  "nom": "Prénom Nom",
  "titre": "Intitulé du poste ciblé",
  "contact": ["email", "téléphone", "ville", "linkedin"],
  "competences": ["Compétence 1", "Compétence 2"],
  "langues": ["Français — natif", "Anglais — B2"],
  "formation": [{ "diplome": "Diplôme", "etablissement": "École", "annee": "2022" }],
  "accroche": "Phrases percutantes présentant le candidat pour ce poste.",
  "experiences": [{
    "poste": "Poste",
    "entreprise": "Entreprise",
    "periode": "2022 — 2024",
    "bullets": ["Réalisation concrète"]
  }],
  "paragrapheMotsCles": "Phrases naturelles intégrant les mots-clés de l'offre pour remplir la page."
}

CV ORIGINAL :
${cvText}

OFFRE D'EMPLOI :
${jobText}`
}

export async function rewriteCV(cvText: string, jobText: string): Promise<CvStructure> {
  const response = await client.chat.complete({
    model: "mistral-small-latest",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(cvText, jobText) },
    ],
    temperature: 0.15,
    maxTokens: 3500,
  })

  const content = response.choices?.[0]?.message?.content
  if (!content || typeof content !== "string") {
    throw new Error("Réponse Mistral vide ou invalide.")
  }

  const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim()

  try {
    return JSON.parse(cleaned) as CvStructure
  } catch {
    throw new Error("L'IA n'a pas retourné un CV structuré valide. Réessaie.")
  }
}
