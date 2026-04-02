"use client"

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  AlignmentType,
  VerticalAlign,
} from "docx"
import { saveAs } from "file-saver"
import type { CvStructure } from "@/lib/mistral-rewrite"

// Couleurs
const BLEU = "1E3A8A"
const BLEU_CLAIR = "DBEAFE"
const GRIS_TEXTE = "374151"
const BLANC = "FFFFFF"

// Cellule sans bordure
const AUCUNE_BORDURE = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
}

// Titre de section dans la colonne gauche (fond bleu)
function titreSectionGauche(texte: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    shading: { type: ShadingType.CLEAR, fill: BLEU },
    children: [
      new TextRun({
        text: texte.toUpperCase(),
        bold: true,
        color: BLANC,
        size: 18,
        font: "Calibri",
      }),
    ],
  })
}

// Titre de section dans la colonne droite (soulignement bleu)
function titreSectionDroite(texte: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 8, color: BLEU, space: 4 },
    },
    children: [
      new TextRun({
        text: texte.toUpperCase(),
        bold: true,
        color: BLEU,
        size: 20,
        font: "Calibri",
      }),
    ],
  })
}

// Texte simple dans la colonne gauche
function texteGauche(contenu: string, bold = false): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({
        text: contenu,
        bold,
        color: BLANC,
        size: 17,
        font: "Calibri",
      }),
    ],
  })
}

// Puce dans la colonne gauche
function puceGauche(contenu: string): Paragraph {
  return new Paragraph({
    spacing: { after: 50 },
    children: [
      new TextRun({ text: "· ", color: BLEU_CLAIR, size: 17, font: "Calibri" }),
      new TextRun({ text: contenu, color: BLANC, size: 17, font: "Calibri" }),
    ],
  })
}

// Puce dans la colonne droite
function puceDroite(contenu: string): Paragraph {
  return new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: "— ", color: BLEU, bold: true, size: 18, font: "Calibri" }),
      new TextRun({ text: contenu, color: GRIS_TEXTE, size: 18, font: "Calibri" }),
    ],
  })
}

// Construit la colonne gauche (fond bleu foncé)
function construireColonneGauche(cv: CvStructure): Paragraph[] {
  const paragraphes: Paragraph[] = []

  // Nom + titre
  paragraphes.push(
    new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: cv.nom, bold: true, color: BLANC, size: 28, font: "Calibri" })],
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: cv.titre, color: BLEU_CLAIR, size: 18, font: "Calibri", italics: true })],
    })
  )

  // Contact
  paragraphes.push(titreSectionGauche("Contact"))
  for (const ligne of cv.contact) {
    paragraphes.push(texteGauche(ligne))
  }

  // Compétences
  paragraphes.push(titreSectionGauche("Compétences"))
  for (const comp of cv.competences) {
    paragraphes.push(puceGauche(comp))
  }

  // Langues
  if (cv.langues.length > 0) {
    paragraphes.push(titreSectionGauche("Langues"))
    for (const langue of cv.langues) {
      paragraphes.push(puceGauche(langue))
    }
  }

  // Formation
  if (cv.formation.length > 0) {
    paragraphes.push(titreSectionGauche("Formation"))
    for (const f of cv.formation) {
      paragraphes.push(texteGauche(f.diplome, true))
      paragraphes.push(texteGauche(`${f.etablissement} · ${f.annee}`))
    }
  }

  return paragraphes
}

// Construit la colonne droite (fond blanc)
function construireColonneDroite(cv: CvStructure): Paragraph[] {
  const paragraphes: Paragraph[] = []

  // Accroche
  paragraphes.push(titreSectionDroite("Profil"))
  paragraphes.push(
    new Paragraph({
      spacing: { after: 200 },
      children: [new TextRun({ text: cv.accroche, color: GRIS_TEXTE, size: 18, font: "Calibri" })],
    })
  )

  // Expériences
  paragraphes.push(titreSectionDroite("Expériences"))
  for (const exp of cv.experiences) {
    paragraphes.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: exp.poste, bold: true, color: GRIS_TEXTE, size: 19, font: "Calibri" }),
          new TextRun({ text: `  ·  ${exp.entreprise}  ·  ${exp.periode}`, color: "6B7280", size: 17, font: "Calibri" }),
        ],
      })
    )
    for (const bullet of exp.bullets) {
      paragraphes.push(puceDroite(bullet))
    }
  }

  // Domaines d'expertise — phrases naturelles intégrant les mots-clés
  if (cv.paragrapheMotsCles) {
    paragraphes.push(titreSectionDroite("Domaines d'expertise"))
    paragraphes.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: cv.paragrapheMotsCles,
            color: "4B5563",
            size: 17,
            font: "Calibri",
            italics: true,
          }),
        ],
      })
    )
  }

  return paragraphes
}

// Génère et télécharge le .docx en 2 colonnes
export async function telechargerDocx(cv: CvStructure, nomFichierOriginal: string) {
  const colonneGauche = construireColonneGauche(cv)
  const colonneDroite = construireColonneDroite(cv)

  // Largeurs : 35% gauche, 65% droite (en twips, total ~9000)
  const LARGEUR_GAUCHE = 3150
  const LARGEUR_DROITE = 5850

  const tableau = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0 },
      bottom: { style: BorderStyle.NONE, size: 0 },
      left: { style: BorderStyle.NONE, size: 0 },
      right: { style: BorderStyle.NONE, size: 0 },
      insideHorizontal: { style: BorderStyle.NONE, size: 0 },
      insideVertical: { style: BorderStyle.NONE, size: 0 },
    },
    rows: [
      new TableRow({
        children: [
          // Colonne gauche — fond bleu
          new TableCell({
            width: { size: LARGEUR_GAUCHE, type: WidthType.DXA },
            verticalAlign: VerticalAlign.TOP,
            shading: { type: ShadingType.CLEAR, fill: BLEU },
            borders: AUCUNE_BORDURE,
            margins: { top: 300, bottom: 300, left: 300, right: 300 },
            children: colonneGauche,
          }),
          // Colonne droite — fond blanc
          new TableCell({
            width: { size: LARGEUR_DROITE, type: WidthType.DXA },
            verticalAlign: VerticalAlign.TOP,
            shading: { type: ShadingType.CLEAR, fill: BLANC },
            borders: AUCUNE_BORDURE,
            margins: { top: 300, bottom: 300, left: 400, right: 300 },
            children: colonneDroite,
          }),
        ],
      }),
    ],
  })

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 600, bottom: 600, left: 600, right: 600 },
          },
        },
        children: [tableau],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const nom = nomFichierOriginal.replace(/\.(pdf|docx)$/i, "") + "_optimise.docx"
  saveAs(blob, nom)
}
