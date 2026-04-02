// Server-side PDF generation using @react-pdf/renderer
// A4 dimensions are handled natively — no scaling, no html2canvas

import React from "react"
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer"
import type { CvStructure } from "@/lib/mistral-rewrite"

const BLEU = "#1e3a8a"
const BLEU_CLAIR = "#bfdbfe"
const BLEU_MED = "#93c5fd"
const BLEU_BORDER = "#1d4ed8"
const BLANC = "#ffffff"
const GRIS = "#374151"
const GRIS_CLAIR = "#6b7280"
const GRIS_SUBTITLE = "#4b5563"

// A4 = 595pt × 842pt (react-pdf native unit)
// Compact spacing to guarantee 1-page fit

// Helper function to scale values based on fontScale
function s(base: number, scale: number): number {
  return base * scale
}

// Dynamic styles function that takes fontScale into account
function createStyles(fontScale: number) {
  return StyleSheet.create({
    page: {
      flexDirection: "row",
      fontFamily: "Helvetica",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    },

    // ── Colonne gauche ──────────────────────────────
    left: {
      width: "35%",
      maxHeight: 841,
      backgroundColor: BLEU,
      padding: s(12, fontScale),
      flexDirection: "column",
      overflow: "hidden",
    },
    nom: {
      fontSize: s(14, fontScale),
      fontFamily: "Helvetica-Bold",
      color: BLANC,
      marginBottom: s(1, fontScale),
    },
    titre: {
      fontSize: s(7.5, fontScale),
      color: BLEU_CLAIR,
      fontFamily: "Helvetica-Oblique",
      marginBottom: s(6, fontScale),
    },
    sectionTitleLeft: {
      fontSize: s(6.5, fontScale),
      fontFamily: "Helvetica-Bold",
      color: BLEU_MED,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      borderBottomWidth: 0.5,
      borderBottomColor: BLEU_BORDER,
      paddingBottom: s(2, fontScale),
      marginBottom: s(3, fontScale),
      marginTop: s(7, fontScale),
    },
    contactLine: {
      fontSize: s(7, fontScale),
      color: BLEU_CLAIR,
      marginBottom: s(1.5, fontScale),
    },
    bullet: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: s(1.5, fontScale),
    },
    bulletDot: {
      width: s(3, fontScale),
      height: s(3, fontScale),
      borderRadius: s(1.5, fontScale),
      backgroundColor: "#60a5fa",
      marginTop: s(2, fontScale),
      marginRight: s(3, fontScale),
      flexShrink: 0,
    },
    bulletText: {
      fontSize: s(7, fontScale),
      color: BLEU_CLAIR,
      flex: 1,
      lineHeight: 1.3,
    },
    formationDiplome: {
      fontSize: s(7, fontScale),
      fontFamily: "Helvetica-Bold",
      color: BLANC,
      marginBottom: s(1, fontScale),
    },
    formationMeta: {
      fontSize: s(6.5, fontScale),
      color: BLEU_CLAIR,
      marginBottom: s(3, fontScale),
    },

    // ── Colonne droite ──────────────────────────────
    right: {
      flex: 1,
      maxHeight: 841,
      backgroundColor: BLANC,
      padding: s(16, fontScale),
      paddingLeft: s(14, fontScale),
      flexDirection: "column",
      overflow: "hidden",
    },
    sectionTitleRight: {
      fontSize: s(7.5, fontScale),
      fontFamily: "Helvetica-Bold",
      color: BLEU,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      borderBottomWidth: 0.75,
      borderBottomColor: BLEU_BORDER,
      paddingBottom: s(2, fontScale),
      marginBottom: s(4, fontScale),
      marginTop: s(8, fontScale),
    },
    accroche: {
      fontSize: s(7.5, fontScale),
      color: GRIS,
      lineHeight: 1.4,
      marginBottom: s(2, fontScale),
    },
    expPoste: {
      fontSize: s(8, fontScale),
      fontFamily: "Helvetica-Bold",
      color: "#111827",
    },
    expMeta: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: s(1, fontScale),
    },
    expEntreprise: {
      fontSize: s(7, fontScale),
      color: BLEU_BORDER,
      fontFamily: "Helvetica-Bold",
      marginBottom: s(1.5, fontScale),
    },
    expPeriode: {
      fontSize: s(6.5, fontScale),
      color: GRIS_CLAIR,
    },
    expBullet: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: s(1, fontScale),
    },
    expBulletDash: {
      fontSize: s(7.5, fontScale),
      color: BLEU_BORDER,
      fontFamily: "Helvetica-Bold",
      marginRight: s(3, fontScale),
      lineHeight: 1.3,
    },
    expBulletText: {
      fontSize: s(7, fontScale),
      color: GRIS,
      lineHeight: 1.35,
      flex: 1,
    },
    expBlock: {
      marginBottom: s(4, fontScale),
    },
    motsCles: {
      fontSize: s(7, fontScale),
      color: GRIS_SUBTITLE,
      fontFamily: "Helvetica-Oblique",
      lineHeight: 1.4,
    },
  })
}

export function CvDocument({ cv, fontScale = 1.0 }: { cv: CvStructure; fontScale?: number }) {
  const styles = createStyles(fontScale)

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Colonne gauche ── */}
        <View style={styles.left}>
          <Text style={styles.nom}>{cv.nom}</Text>
          <Text style={styles.titre}>{cv.titre}</Text>

          <Text style={styles.sectionTitleLeft}>Contact</Text>
          {cv.contact.map((ligne, i) => (
            <Text key={i} style={styles.contactLine}>{ligne}</Text>
          ))}

          <Text style={styles.sectionTitleLeft}>Compétences</Text>
          {cv.competences.map((comp, i) => (
            <View key={i} style={styles.bullet}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{comp}</Text>
            </View>
          ))}

          {cv.langues.length > 0 && (
            <>
              <Text style={styles.sectionTitleLeft}>Langues</Text>
              {cv.langues.map((langue, i) => (
                <View key={i} style={styles.bullet}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{langue}</Text>
                </View>
              ))}
            </>
          )}

          {cv.formation.length > 0 && (
            <>
              <Text style={styles.sectionTitleLeft}>Formation</Text>
              {cv.formation.map((f, i) => (
                <View key={i}>
                  <Text style={styles.formationDiplome}>{f.diplome}</Text>
                  <Text style={styles.formationMeta}>{f.etablissement} · {f.annee}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* ── Colonne droite ── */}
        <View style={styles.right}>
          <Text style={[styles.sectionTitleRight, { marginTop: 0 }]}>Profil</Text>
          <Text style={styles.accroche}>{cv.accroche}</Text>

          <Text style={styles.sectionTitleRight}>Expériences</Text>
          {cv.experiences.map((exp, i) => (
            <View key={i} style={styles.expBlock}>
              <View style={styles.expMeta}>
                <Text style={styles.expPoste}>{exp.poste}</Text>
                <Text style={styles.expPeriode}>{exp.periode}</Text>
              </View>
              <Text style={styles.expEntreprise}>{exp.entreprise}</Text>
              {exp.bullets.map((b, j) => (
                <View key={j} style={styles.expBullet}>
                  <Text style={styles.expBulletDash}>—</Text>
                  <Text style={styles.expBulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}

          {cv.paragrapheMotsCles && (
            <>
              <Text style={styles.sectionTitleRight}>Domaines d&apos;expertise</Text>
              <Text style={styles.motsCles}>{cv.paragrapheMotsCles}</Text>
            </>
          )}
        </View>

      </Page>
    </Document>
  )
}
