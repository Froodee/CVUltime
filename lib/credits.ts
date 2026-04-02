import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export type CreditStatus =
  | { allowed: true }
  | { allowed: false; reason: string; code: string }

/**
 * Vérifie si l'utilisateur peut effectuer une analyse ou réécriture.
 * - Non connecté : 1 analyse gratuite via cookie
 * - Connecté : 1 analyse gratuite, puis crédits payants (1 crédit = 1 analyse)
 * - isPremium : illimité
 */
export async function checkCredits(): Promise<CreditStatus> {
  const { userId: clerkId } = await auth()

  if (!clerkId) {
    // Non connecté : la vérification cookie se fait dans chaque route API
    return { allowed: true }
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { analyses: { select: { id: true } } },
  })

  // Nouveau user → analyse gratuite
  if (!user) return { allowed: true }

  // Premium → illimité
  if (user.isPremium) return { allowed: true }

  // Crédits payants disponibles → autorisé
  if (user.credits > 0) return { allowed: true }

  // Première analyse → gratuite
  if (user.analyses.length === 0) return { allowed: true }

  return {
    allowed: false,
    reason: "Tu as utilisé ton analyse gratuite. Achète 1 crédit pour continuer.",
    code: "NO_CREDITS",
  }
}

/**
 * Consomme 1 crédit payant si l'utilisateur en a.
 * À appeler après une analyse/réécriture réussie.
 */
export async function consommerCredit(clerkId: string) {
  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user || user.isPremium || user.credits <= 0) return

  await prisma.user.update({
    where: { clerkId },
    data: { credits: { decrement: 1 } },
  })
}

/**
 * Crée ou récupère l'utilisateur Clerk en DB.
 */
export async function upsertUser(clerkId: string, email: string) {
  return prisma.user.upsert({
    where: { clerkId },
    create: { clerkId, email },
    update: {},
  })
}
