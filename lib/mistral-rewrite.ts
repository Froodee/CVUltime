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
  return `Réécris ce CV en JSON structuré pour un format 2 colonnes A4, STRICTEMENT 1 PAGE.

OBJECTIF DOUBLE :
1. REMPLIR LA PAGE A4 ENTIÈRE — pas de blanc en bas. Le contenu doit occuper toute la hauteur.
2. Maximiser la compatibilité ATS avec l'offre d'emploi fournie.

OPTIMISATION ATS :
- Réutilise les mots-clés EXACTS de l'offre dans les bullets et l'accroche (les ATS font du matching exact).
- Mets en avant les compétences techniques demandées dans l'offre en premier dans la liste.
- Le titre doit reprendre l'intitulé du poste de l'offre.

RÈGLES DE VOLUME — génère suffisamment pour remplir la page :
- accroche : 4-5 phrases percutantes, 70-90 mots minimum.
- experiences : toutes les expériences (max 4). 3-4 bullets par expérience, 15-20 mots chacun, détaillés et orientés résultats.
- paragrapheMotsCles : MINIMUM 120 mots. 5-7 phrases fluides et naturelles intégrant tous les mots-clés de l'offre restants (technologies, méthodes, soft skills, certifications). C'est la section qui remplit l'espace blanc en bas — elle doit être substantielle.
- competences : toutes les compétences pertinentes, max 14 éléments.
- contact : max 4 lignes.
- formation : toutes les formations, max 3 entrées.
- langues : toutes les langues, max 3 entrées.

Tu n'inventes RIEN. Tu reformules et enrichis ce qui existe. Pas d'astérisques, pas de markdown dans les valeurs.

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
    maxTokens: 3200,
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

  let parsed: CvStructure
  try {
    parsed = JSON.parse(cleaned) as CvStructure
  } catch {
    throw new Error("L'IA n'a pas retourné un CV structuré valide. Réessaie.")
  }

  // Hard limits — truncate if Mistral exceeded the prompt constraints
  return enforceLimits(parsed)
}

function enforceLimits(cv: CvStructure): CvStructure {
  return {
    ...cv,
    contact: cv.contact.slice(0, 4),
    competences: cv.competences.slice(0, 14),
    langues: cv.langues.slice(0, 3),
    formation: cv.formation.slice(0, 3),
    experiences: cv.experiences.slice(0, 4).map((exp) => ({
      ...exp,
      bullets: exp.bullets.slice(0, 3),
    })),
  }
}
