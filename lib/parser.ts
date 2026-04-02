// Extraction de texte depuis PDF et DOCX
// Les fichiers sont traités en mémoire uniquement, jamais stockés sur disque

export async function extractTextFromBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<string> {
  if (mimeType === "application/pdf" || fileName.endsWith(".pdf")) {
    return extractFromPdf(buffer)
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx")
  ) {
    return extractFromDocx(buffer)
  }

  throw new Error("Format non supporté. Uploadez un fichier PDF ou DOCX.")
}

async function extractFromPdf(buffer: Buffer): Promise<string> {
  // pdf-parse v2 utilise une API classe (PDFParse)
  const { PDFParse } = await import("pdf-parse")

  // Convertit le Buffer Node.js en Uint8Array pour pdf-parse v2
  // Use Buffer directly as Uint8Array to avoid byteOffset issues with pooled Node.js buffers
  const uint8Array = new Uint8Array(buffer)

  const parser = new PDFParse({ data: uint8Array })
  const result = await parser.getText()

  // result.text contient le texte complet concaténé
  const text = result.text.trim()

  if (!text || text.length < 50) {
    throw new Error(
      "Impossible d'extraire le texte de ce PDF. Assurez-vous d'uploader votre CV original (avec texte sélectionnable), pas un PDF généré par scan ou par image."
    )
  }

  return text
}

async function extractFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = await import("mammoth")
  const result = await mammoth.extractRawText({ buffer })
  const text = result.value.trim()

  if (!text || text.length < 50) {
    throw new Error(
      "Le fichier DOCX semble vide ou illisible. Vérifiez son contenu."
    )
  }

  return text
}
