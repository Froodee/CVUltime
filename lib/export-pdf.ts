"use client"

import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

const A4_W = 794
const A4_H = 1123

export async function telechargerPdf(element: HTMLElement, nomFichierOriginal: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    width: A4_W,
    height: A4_H,
  })

  const imgData = canvas.toDataURL("image/jpeg", 0.95)

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  pdf.addImage(imgData, "JPEG", 0, 0, 210, 297)

  const nom = nomFichierOriginal.replace(/\.(pdf|docx)$/i, "") + "_optimise.pdf"
  pdf.save(nom)
}
