import Stripe from "stripe"

// Singleton Stripe côté serveur
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
})

// Prix en centimes
export const PRIX_CREDIT = 100 // 1€ = 100 centimes
export const CREDITS_PAR_ACHAT = 1
