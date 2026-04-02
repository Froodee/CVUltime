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
  return `Réécris ce CV en JSON structuré pour un format 2 colonnes, 1 page.

RÈGLES :
- Garde TOUTES les compétences du CV. Mets les plus pertinentes pour l'offre en premier.
- AJUSTE la densité du contenu pour remplir la page :
  * Si le CV a beaucoup d'expériences → garde les 2-3 plus pertinentes, 2 bullets chacune
  * Si le CV a peu d'expériences → garde-les toutes, 3-4 bullets chacune avec plus de détail
  * Si la colonne droite a encore de l'espace → allonge l'accroche à 3-4 phrases
- paragrapheMotsCles : 2-3 phrases naturelles et fluides intégrant les mots-clés importants de l'offre (technologies, méthodes, soft skills). Ça doit sonner comme un vrai paragraphe, pas une liste. Ce paragraphe remplit l'espace blanc restant dans la colonne droite.
- Tu n'inventes RIEN sur le candidat. Tu reformules ce qui existe.
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
    maxTokens: 2000,
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
