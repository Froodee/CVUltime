import { NextRequest, NextResponse } from "next/server"
import { getStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

// Désactive le body parsing de Next.js — Stripe a besoin du body brut pour vérifier la signature
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature invalide"
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const credits = parseInt(session.metadata?.credits ?? "1", 10)

    if (!userId) {
      return NextResponse.json({ error: "userId manquant dans les metadata" }, { status: 400 })
    }

    // Sauvegarde du paiement + ajout des crédits en une transaction
    await prisma.$transaction([
      prisma.paiement.upsert({
        where: { stripeSessionId: session.id },
        create: {
          userId,
          stripeSessionId: session.id,
          montantCentimes: session.amount_total ?? 100,
          credits,
          statut: "complete",
        },
        update: { statut: "complete" },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits } },
      }),
    ])
  }

  return NextResponse.json({ received: true })
}
