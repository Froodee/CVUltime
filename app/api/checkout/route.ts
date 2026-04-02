import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { stripe, PRIX_CREDIT, CREDITS_PAR_ACHAT } from "@/lib/stripe"
import { upsertUser } from "@/lib/credits"

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth()

  // Doit être connecté pour payer
  if (!clerkId) {
    return NextResponse.json(
      { error: "Tu dois être connecté pour acheter des crédits.", code: "UNAUTHORIZED" },
      { status: 401 }
    )
  }

  // Récupération ou création du user en DB
  const clerkUser = await currentUser()
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? ""
  const dbUser = await upsertUser(clerkId, email)

  // Récupération de la quantité demandée (défaut : 1 crédit)
  let quantite = 1
  try {
    const body = await req.json() as { quantite?: number }
    if (body.quantite && body.quantite > 0 && body.quantite <= 10) {
      quantite = body.quantite
    }
  } catch {
    // body vide → quantite reste 1
  }

  // Création de la session Stripe Checkout
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `CVUltime — ${quantite} analyse${quantite > 1 ? "s" : ""}`,
            description: `${quantite} crédit${quantite > 1 ? "s" : ""} d'analyse ATS · CVUltime`,
          },
          unit_amount: PRIX_CREDIT,
        },
        quantity: quantite,
      },
    ],
    metadata: {
      userId: dbUser.id,
      credits: String(quantite * CREDITS_PAR_ACHAT),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/paiement/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/analyse`,
  })

  return NextResponse.json({ url: session.url })
}
