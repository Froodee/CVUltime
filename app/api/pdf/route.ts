import { NextRequest, NextResponse } from "next/server"
import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { CvDocument } from "@/lib/cv-pdf"
import type { CvStructure } from "@/lib/mistral-rewrite"

type PdfElement = Parameters<typeof renderToBuffer>[0]

async function renderWithAutoScale(cv: CvStructure): Promise<Buffer> {
  for (let scale = 1.0; scale >= 0.65; scale = Math.round((scale - 0.05) * 100) / 100) {
    const element = React.createElement(CvDocument, { cv, fontScale: scale }) as unknown as PdfElement
    const buffer = await renderToBuffer(element)

    // Check page count using pdf-parse
    const { PDFParse } = await import("pdf-parse")
    const parser = new PDFParse({ data: new Uint8Array(buffer) })
    const info = await parser.getInfo()

    // Extract page count - the API might return different structures
    const pageCount = (info as any).numpages || (info as any).pages || (info as any).numPages || 1

    if (pageCount <= 1) {
      return buffer as unknown as Buffer
    }
  }

  // Fallback at minimum scale
  const element = React.createElement(CvDocument, { cv, fontScale: 0.65 }) as unknown as PdfElement
  return renderToBuffer(element) as unknown as Buffer
}

export async function POST(req: NextRequest) {
  let cv: CvStructure
  try {
    cv = (await req.json()) as CvStructure
  } catch {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 })
  }

  const buffer = await renderWithAutoScale(cv)

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cv_optimise.pdf"`,
    },
  })
}

