"use client"

import type { CvStructure } from "@/lib/mistral-rewrite"

export async function telechargerPdf(cv: CvStructure, nomFichierOriginal: string): Promise<void> {
  const res = await fetch("/api/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cv),
  })

  if (!res.ok) throw new Error("Erreur lors de la génération du PDF.")

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = nomFichierOriginal.replace(/\.(pdf|docx)$/i, "") + "_optimise.pdf"
  a.click()
  URL.revokeObjectURL(url)
}
