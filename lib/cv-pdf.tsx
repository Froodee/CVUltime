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

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Helvetica",
    width: "100%",
    height: "100%",
  },

  // ── Colonne gauche ──────────────────────────────
  left: {
    width: "35%",
    height: "100%",
    backgroundColor: BLEU,
    padding: 12,
    flexDirection: "column",
  },
  nom: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: BLANC,
    marginBottom: 1,
  },
  titre: {
    fontSize: 7.5,
    color: BLEU_CLAIR,
    fontFamily: "Helvetica-Oblique",
    marginBottom: 6,
  },
  sectionTitleLeft: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: BLEU_MED,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 0.5,
    borderBottomColor: BLEU_BORDER,
    paddingBottom: 2,
    marginBottom: 3,
    marginTop: 7,
  },
  contactLine: {
    fontSize: 7,
    color: BLEU_CLAIR,
    marginBottom: 1.5,
  },
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 1.5,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#60a5fa",
    marginTop: 2,
    marginRight: 3,
    flexShrink: 0,
  },
  bulletText: {
    fontSize: 7,
    color: BLEU_CLAIR,
    flex: 1,
    lineHeight: 1.3,
  },
  formationDiplome: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: BLANC,
    marginBottom: 1,
  },
  formationMeta: {
    fontSize: 6.5,
    color: BLEU_CLAIR,
    marginBottom: 3,
  },

  // ── Colonne droite ──────────────────────────────
  right: {
    flex: 1,
    height: "100%",
    backgroundColor: BLANC,
    padding: 16,
    paddingLeft: 14,
    flexDirection: "column",
  },
  sectionTitleRight: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: BLEU,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    borderBottomWidth: 0.75,
    borderBottomColor: BLEU_BORDER,
    paddingBottom: 2,
    marginBottom: 4,
    marginTop: 8,
  },
  accroche: {
    fontSize: 7.5,
    color: GRIS,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  expPoste: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  expMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expEntreprise: {
    fontSize: 7,
    color: BLEU_BORDER,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1.5,
  },
  expPeriode: {
    fontSize: 6.5,
    color: GRIS_CLAIR,
  },
  expBullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  expBulletDash: {
    fontSize: 7.5,
    color: BLEU_BORDER,
    fontFamily: "Helvetica-Bold",
    marginRight: 3,
    lineHeight: 1.3,
  },
  expBulletText: {
    fontSize: 7,
    color: GRIS,
    lineHeight: 1.35,
    flex: 1,
  },
  expBlock: {
    marginBottom: 4,
  },
  motsCles: {
    fontSize: 7,
    color: GRIS_SUBTITLE,
    fontFamily: "Helvetica-Oblique",
    lineHeight: 1.4,
  },
})

export function CvDocument({ cv }: { cv: CvStructure }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── Colonne gauche — wrap=false force le clip à la page ── */}
        <View style={styles.left} wrap={false}>
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

        {/* ── Colonne droite — wrap=false force le clip à la page ── */}
        <View style={styles.right} wrap={false}>
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
