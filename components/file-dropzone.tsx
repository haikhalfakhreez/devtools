"use client"

import { useCallback, useRef } from "react"

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void
}

export function FileDropzone({ onFilesSelected }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer.files.length > 0) {
        onFilesSelected(Array.from(e.dataTransfer.files))
      }
    },
    [onFilesSelected],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesSelected(Array.from(e.target.files))
        e.target.value = ""
      }
    },
    [onFilesSelected],
  )

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 p-8 text-center transition-colors hover:bg-muted"
    >
      <p className="text-sm font-medium">Drop files here or click to browse</p>
      <p className="mt-1 text-xs text-muted-foreground">Receipts, invoices, documents (max 25MB each)</p>
      <input ref={inputRef} type="file" multiple onChange={handleChange} className="hidden" />
    </div>
  )
}
