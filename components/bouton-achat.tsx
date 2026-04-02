"use client"

import { useState } from "react"
import { Loader2, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface BoutonAchatProps {
  quantite?: number
  label?: string
  className?: string
}

/**
 * Bouton qui crée une session Stripe et redirige vers le paiement.
 * Nécessite que l'utilisateur soit connecté.
 */
export function BoutonAchat({ quantite = 1, label, className }: BoutonAchatProps) {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantite }),
      })

      const json = await res.json() as { url?: string; error?: string }

      if (!res.ok || !json.url) {
        throw new Error(json.error ?? "Erreur lors de la création du paiement.")
      }

      // Redirection vers Stripe Checkout
      window.location.href = json.url
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur inattendue.")
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
        "bg-blue-500 text-white hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {label ?? `Acheter ${quantite} crédit${quantite > 1 ? "s" : ""} — ${quantite}€`}
    </button>
  )
}
