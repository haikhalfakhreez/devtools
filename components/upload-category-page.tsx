"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/file-dropzone"
import { FileRow } from "@/components/file-row"
import { RECOMMENDED_TITLES, buildRecommendedFilename } from "@/lib/filenames"
import type { Category } from "@/lib/constants"
import type { FileRowData, UploadResponse } from "@/lib/types"

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

const UPLOAD_CONCURRENCY = 3

interface UploadCategoryPageProps {
  category: Category
  label: string
}

export function UploadCategoryPage({ category, label }: UploadCategoryPageProps) {
  const [rows, setRows] = useState<FileRowData[]>([])

  const handleFilesSelected = useCallback(
    (files: File[]) => {
      const newRows: FileRowData[] = files.map((file) => {
        const ext = (file.name.split(".").pop() || "").toLowerCase()
        const defaultTitle = RECOMMENDED_TITLES[category][0]
        return {
          id: generateId(),
          file,
          originalName: file.name,
          ext,
          targetName: buildRecommendedFilename(defaultTitle, ext),
          status: "pending",
        }
      })
      setRows((prev) => [...prev, ...newRows])
    },
    [category],
  )

  const handleTargetNameChange = useCallback((id: string, name: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, targetName: name } : r)))
  }, [])

  const handleRetry = useCallback((id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "pending" as const, error: undefined } : r)))
  }, [])

  const handleUpload = useCallback(async () => {
    const pendingRows = rows.filter((r) => r.status === "pending")
    if (pendingRows.length === 0) return

    for (let i = 0; i < pendingRows.length; i += UPLOAD_CONCURRENCY) {
      const batch = pendingRows.slice(i, i + UPLOAD_CONCURRENCY)
      const results = await Promise.allSettled(
        batch.map(async (row) => {
          setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: "uploading" } : r)))

          const formData = new FormData()
          formData.append("file", row.file)
          formData.append("category", category)
          formData.append("filename", row.targetName)

          const res = await fetch("/api/drive/upload", {
            method: "POST",
            body: formData,
          })

          const json: UploadResponse = await res.json()

          if (!json.success || !json.file) {
            throw new Error(json.error || "Upload failed")
          }

          setRows((prev) =>
            prev.map((r) =>
              r.id === row.id
                ? {
                    ...r,
                    status: "success",
                    driveFileId: json.file!.id,
                    driveLink: json.file!.webViewLink,
                  }
                : r,
            ),
          )
        }),
      )

      for (let j = 0; j < results.length; j++) {
        const result = results[j]
        const row = batch[j]
        if (result.status === "rejected") {
          setRows((prev) =>
            prev.map((r) =>
              r.id === row.id
                ? { ...r, status: "error", error: result.reason instanceof Error ? result.reason.message : "Upload failed" }
                : r,
            ),
          )
        }
      }
    }
  }, [rows, category])

  const handleDone = useCallback(() => {
    setRows([])
  }, [])

  const pendingCount = rows.filter((r) => r.status === "pending").length
  const allDone = rows.length > 0 && rows.every((r) => r.status === "success" || r.status === "error")

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link
          href="/upload"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1 className="text-xl font-medium">{label}</h1>
      </div>

      <FileDropzone onFilesSelected={handleFilesSelected} />

      {rows.length > 0 && (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <FileRow
              key={row.id}
              row={row}
              recommendedTitles={RECOMMENDED_TITLES[category]}
              onTargetNameChange={handleTargetNameChange}
              onRetry={handleRetry}
            />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        {pendingCount > 0 && (
          <Button onClick={handleUpload}>
            Upload ({pendingCount} file{pendingCount !== 1 ? "s" : ""})
          </Button>
        )}
        {allDone && (
          <Button variant="outline" onClick={handleDone}>
            Upload more
          </Button>
        )}
      </div>
    </div>
  )
}
