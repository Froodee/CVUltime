"use client"

import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

export async function telechargerPdf(element: HTMLElement, nomFichierOriginal: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  })

  const imgData = canvas.toDataURL("image/jpeg", 0.95)

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Fit to A4 — 210mm × 297mm — exactly what you see is what you get
  pdf.addImage(imgData, "JPEG", 0, 0, 210, 297)

  const nom = nomFichierOriginal.replace(/\.(pdf|docx)$/i, "") + "_optimise.pdf"
  pdf.save(nom)
}
