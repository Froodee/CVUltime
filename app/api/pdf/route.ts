import { NextRequest, NextResponse } from "next/server"
import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { CvDocument } from "@/lib/cv-pdf"
import type { CvStructure } from "@/lib/mistral-rewrite"

type PdfElement = Parameters<typeof renderToBuffer>[0]

export async function POST(req: NextRequest) {
  let cv: CvStructure
  try {
    cv = (await req.json()) as CvStructure
  } catch {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 })
  }

  const element = React.createElement(CvDocument, { cv }) as unknown as PdfElement
  const buffer = await renderToBuffer(element)

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="cv_optimise.pdf"`,
    },
  })
}

