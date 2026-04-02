import Stripe from "stripe"

// Prix en centimes
export const PRIX_CREDIT = 100 // 1€ = 100 centimes
export const CREDITS_PAR_ACHAT = 1

// Lazy singleton — avoids build-time crash when STRIPE_SECRET_KEY is not set
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    })
  }
  return _stripe
}
