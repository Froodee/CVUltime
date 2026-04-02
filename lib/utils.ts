import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utilitaire pour fusionner les classes Tailwind sans conflits
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formate la taille d'un fichier en unité lisible
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

// Retourne la couleur en fonction du score (0-100)
export function getScoreColor(score: number): string {
  if (score >= 70) return "text-green-400"
  if (score >= 40) return "text-orange-400"
  return "text-red-400"
}

// Retourne la couleur hex en fonction du score
export function getScoreHex(score: number): string {
  if (score >= 70) return "#22c55e"
  if (score >= 40) return "#f97316"
  return "#ef4444"
}

// Retourne le label de score
export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent"
  if (score >= 70) return "Bon"
  if (score >= 50) return "Moyen"
  if (score >= 40) return "Passable"
  return "Insuffisant"
}

// Retourne la couleur bg selon la priorité
export function getPriorite(priorite: "haute" | "moyenne" | "faible"): string {
  switch (priorite) {
    case "haute":
      return "bg-red-500/20 text-red-300 border-red-500/30"
    case "moyenne":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    case "faible":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
  }
}

// Retourne la couleur bg selon l'impact
export function getImpact(impact: "fort" | "moyen" | "faible"): string {
  switch (impact) {
    case "fort":
      return "bg-red-500/20 text-red-300 border-red-500/30"
    case "moyen":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30"
    case "faible":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
  }
}
