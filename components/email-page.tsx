"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface PreviewResponse {
  success: boolean
  preview?: {
    monthName: string
    monthNumber: number
    year: number
    subject: string
    recipients: string[]
    expectedFiles: Array<{ title: string; fileName: string }>
    matchedFiles: Array<{ title: string; fileName: string }>
    isReady: boolean
    message: string
  }
  error?: string
}

export function EmailPageClient() {
  const [preview, setPreview] = useState<PreviewResponse["preview"] | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const loadPreview = async () => {
    setLoading(true)
    setError(null)

    const response = await fetch("/api/email/preview")
    const json: PreviewResponse = await response.json()

    if (!json.success || !json.preview) {
      setError(json.error ?? "Unable to load preview")
      setPreview(null)
      setLoading(false)
      return
    }

    setPreview(json.preview)
    setShowConfirmation(false)
    setLoading(false)
  }

  useEffect(() => {
    void loadPreview()
  }, [])

  const handleSubmit = async () => {
    if (!preview?.isReady) {
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
    const json = await response.json()

    if (!json.success) {
      setError(json.error ?? "Unable to send email")
      setSubmitting(false)
      return
    }

    setSuccess("Email sent successfully.")
    await loadPreview()
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <Link href="/upload" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            Back
          </Link>
          <h1 className="text-xl font-medium">Miyu email</h1>
        </div>
        <p className="text-sm text-muted-foreground">Checking the current month receipts…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/upload" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1 className="text-xl font-medium">Miyu email</h1>
      </div>

      <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
        <button
          type="button"
          onClick={() => preview?.isReady && setShowConfirmation(true)}
          disabled={!preview?.isReady}
          className={`w-full rounded-md border p-4 text-left transition ${preview?.isReady ? "border-primary/40 bg-muted/40 hover:bg-muted" : "cursor-not-allowed border-border bg-muted/50 text-muted-foreground"}`}
        >
          <div className="text-sm font-medium">Send Miyu email for {preview?.monthName ?? "this month"} {preview?.year ?? ""}</div>
          <div className="mt-1 text-xs text-muted-foreground">{preview?.subject}</div>
        </button>

        {preview && !preview.isReady && (
          <p className="mt-3 text-sm text-destructive">{preview.message}</p>
        )}
      </div>

      {showConfirmation && preview?.isReady && (
        <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
          <h2 className="text-sm font-medium">Review before sending</h2>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">To:</span> {preview.recipients.join(", ")}
            </p>
            <p>
              <span className="font-medium text-foreground">Subject:</span> {preview.subject}
            </p>
            <p>
              <span className="font-medium text-foreground">Attachments:</span> {preview.expectedFiles.map((file) => file.title).join(", ")}
            </p>
          </div>
          <Button className="mt-4" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Sending…" : "Submit"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </div>
  )
}
