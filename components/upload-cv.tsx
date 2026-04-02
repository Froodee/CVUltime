"use client"

import { useCallback, useRef, useState } from "react"
import { Upload, FileText, X, AlertCircle } from "lucide-react"
import { cn, formatFileSize } from "@/lib/utils"

export interface UploadCvProps {
  onFileSelect: (file: File | null) => void
  file: File | null
}

const FORMATS_ACCEPTES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
const TAILLE_MAX = 5 * 1024 * 1024 // 5MB

export function UploadCv({ onFileSelect, file }: UploadCvProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  // Valide le fichier et remonte l'état au parent
  const validerEtSelectionner = useCallback(
    (fichier: File) => {
      setErreur(null)

      const extensionValide = fichier.name.match(/\.(pdf|docx)$/i)
      const typeValide = FORMATS_ACCEPTES.includes(fichier.type)

      if (!extensionValide && !typeValide) {
        setErreur("Format non supporté. Utilisez un fichier PDF ou DOCX.")
        onFileSelect(null)
        return
      }

      if (fichier.size > TAILLE_MAX) {
        setErreur(`Le fichier est trop volumineux (max 5 Mo). Taille actuelle : ${formatFileSize(fichier.size)}.`)
        onFileSelect(null)
        return
      }

      onFileSelect(fichier)
    },
    [onFileSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)

      const dropped = e.dataTransfer.files[0]
      if (dropped) validerEtSelectionner(dropped)
    },
    [validerEtSelectionner]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) validerEtSelectionner(selected)
    },
    [validerEtSelectionner]
  )

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onFileSelect(null)
      setErreur(null)
      if (inputRef.current) inputRef.current.value = ""
    },
    [onFileSelect]
  )

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        inputRef.current?.click()
      }
    },
    []
  )

  // Icône selon l'extension du fichier
  const getIconeType = () => {
    if (!file) return null
    const ext = file.name.split(".").pop()?.toLowerCase()
    return ext === "pdf" ? "PDF" : "DOCX"
  }

  return (
    <div className="w-full">
      {/* Zone de dépôt */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Zone de dépôt de fichier CV"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative w-full rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer outline-none",
          "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]",
          // État normal
          !file && !isDragOver && !erreur && "border-[#475569] bg-[#1e293b] hover:border-blue-500 hover:bg-[#1e293b]/80",
          // Drag over
          isDragOver && "border-blue-400 bg-blue-500/10 scale-[1.01]",
          // Fichier sélectionné
          file && !erreur && "border-green-500/50 bg-green-500/5 hover:border-green-400",
          // Erreur
          erreur && "border-red-500/50 bg-red-500/5 hover:border-red-400",
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
          {file && !erreur ? (
            // Aperçu du fichier sélectionné
            <>
              <div className="flex items-center gap-3 rounded-lg bg-[#0f172a] px-4 py-3 border border-green-500/20">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 font-bold text-xs">
                  {getIconeType()}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label="Supprimer le fichier"
                  className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#334155] text-[#94a3b8] hover:bg-red-500/20 hover:text-red-400 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                Fichier prêt à être analysé
              </p>
            </>
          ) : (
            // Zone de dépôt vide
            <>
              <div
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full transition-colors",
                  isDragOver ? "bg-blue-500/20" : "bg-[#0f172a]"
                )}
              >
                {isDragOver ? (
                  <FileText className="h-7 w-7 text-blue-400 animate-bounce" />
                ) : (
                  <Upload className="h-7 w-7 text-[#94a3b8]" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {isDragOver
                    ? "Relâche pour déposer"
                    : "Glisse ton CV ici ou clique pour choisir"}
                </p>
                <p className="mt-1 text-xs text-[#94a3b8]">
                  PDF ou DOCX — maximum 5 Mo
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Message d'erreur */}
      {erreur && (
        <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-300">{erreur}</p>
        </div>
      )}

      {/* Input masqué */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={handleInputChange}
        className="sr-only"
        aria-hidden="true"
      />
    </div>
  )
}
