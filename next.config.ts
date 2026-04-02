import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Configuration pour les fichiers binaires (pdf-parse, mammoth)
  serverExternalPackages: ["pdf-parse", "mammoth"],
  // Limite de taille pour l'upload de fichiers CV
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
}

export default nextConfig
