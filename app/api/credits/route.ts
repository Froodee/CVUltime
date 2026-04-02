import { NextResponse } from "next/server"
import { checkCredits } from "@/lib/credits"

// Retourne le statut des crédits de l'utilisateur courant
export async function GET() {
  const status = await checkCredits()
  return NextResponse.json(status)
}
