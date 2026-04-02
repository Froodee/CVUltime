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
  const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)

  const parser = new PDFParse({ data: uint8Array })
  const result = await parser.getText()

  // result.text contient le texte complet concaténé
  const text = result.text.trim()

  if (!text || text.length < 50) {
    throw new Error(
      "Le PDF semble vide ou illisible. Vérifiez qu'il contient du texte (pas uniquement des images)."
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
