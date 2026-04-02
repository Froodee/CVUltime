import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import { z } from "zod"
import { extractTextFromBuffer } from "@/lib/parser"
import { rewriteCV } from "@/lib/mistral-rewrite"
import { consommerCredit } from "@/lib/credits"

// Limite : 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Rate limiting simple en mémoire (3 req/min par IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return true
  }

  if (entry.count >= 3) return false

  entry.count++
  return true
}

// Nom du cookie posé après une analyse gratuite (non connecté)
const COOKIE_USED = "cvultime_used"

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: "Trop de requêtes. Attends 1 minute avant de réessayer.",
        code: "RATE_LIMIT",
      },
      { status: 429 }
    )
  }

  // TEST_MODE=true bypasse tous les checks de crédits (tests en local uniquement)
  const testMode = process.env.TEST_MODE === "true"

  // Vérification du cookie pour les utilisateurs non connectés
  const { userId: clerkId } = await auth()
  if (!testMode && !clerkId) {
    const cookieStore = await cookies()
    if (cookieStore.get(COOKIE_USED)?.value === "1") {
      return NextResponse.json(
        {
          error:
            "Tu as déjà utilisé ta réécriture gratuite. Connecte-toi ou passe à 1€ pour continuer.",
          code: "NO_CREDITS",
        },
        { status: 402 }
      )
    }
  }

  // Lecture du FormData
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json(
      { error: "Données de formulaire invalides.", code: "INVALID_FORM" },
      { status: 400 }
    )
  }

  const cvFile = formData.get("cv") as File | null
  const offreText = formData.get("offre") as string | null

  // Validation des inputs
  const schema = z.object({
    offre: z
      .string()
      .min(50, "L'offre d'emploi doit faire au moins 50 caractères."),
  })

  const validation = schema.safeParse({ offre: offreText })
  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.error.issues[0].message,
        code: "INVALID_INPUT",
      },
      { status: 400 }
    )
  }

  if (!cvFile) {
    return NextResponse.json(
      { error: "Aucun fichier CV fourni.", code: "NO_FILE" },
      { status: 400 }
    )
  }

  // Vérification taille
  if (cvFile.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Le fichier dépasse 5MB.", code: "FILE_TOO_LARGE" },
      { status: 400 }
    )
  }

  // Vérification format
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]
  if (
    !allowedTypes.includes(cvFile.type) &&
    !cvFile.name.match(/\.(pdf|docx)$/i)
  ) {
    return NextResponse.json(
      {
        error: "Format non supporté. Uploadez un PDF ou DOCX.",
        code: "INVALID_FORMAT",
      },
      { status: 400 }
    )
  }

  // Extraction du texte du CV
  let cvText: string
  try {
    const arrayBuffer = await cvFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    cvText = await extractTextFromBuffer(buffer, cvFile.type, cvFile.name)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la lecture du CV."
    return NextResponse.json(
      { error: message, code: "PARSE_ERROR" },
      { status: 422 }
    )
  }

  // Appel Mistral pour la réécriture structurée (format 2 colonnes)
  let cvReecrit
  try {
    cvReecrit = await rewriteCV(cvText, validation.data.offre)
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur lors de la réécriture IA."
    return NextResponse.json(
      { error: message, code: "AI_ERROR" },
      { status: 500 }
    )
  }

  // Consomme 1 crédit payant si l'utilisateur est connecté
  if (clerkId) {
    await consommerCredit(clerkId).catch(() => {}) // ne bloque pas le résultat
  }

  // Pour les non-connectés : on pose le cookie après une réécriture réussie
  const response = NextResponse.json({ success: true, data: { cvReecrit } })
  if (!clerkId) {
    response.cookies.set(COOKIE_USED, "1", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365, // 365 jours
      path: "/",
      sameSite: "lax",
    })
  }
  return response
}
