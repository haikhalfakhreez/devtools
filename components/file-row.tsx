"use client"

import type { FileRowData } from "@/lib/types"

interface FileRowProps {
  row: FileRowData
  recommendedTitles: string[]
  onTargetNameChange: (id: string, name: string) => void
  onRetry: (id: string) => void
}

export function FileRow({ row, recommendedTitles, onTargetNameChange, onRetry }: FileRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4">
      <p className="truncate text-xs text-muted-foreground">{row.originalName}</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={row.targetName}
          onChange={(e) => onTargetNameChange(row.id, e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
        />
        <StatusBadge status={row.status} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {recommendedTitles.map((title) => (
          <button
            key={title}
            type="button"
            onClick={() =>
              onTargetNameChange(
                row.id,
                `${new Date().getMonth() + 1}. ${title} - ${new Date().toLocaleString("en-US", { month: "short" })} ${new Date().getFullYear()}.${row.ext}`,
              )
            }
            className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs transition-colors hover:bg-muted/80"
          >
            {title}
          </button>
        ))}
      </div>
      {row.status === "error" && row.error && (
        <div className="flex items-center gap-2">
          <p className="text-xs text-destructive">{row.error}</p>
          <button
            type="button"
            onClick={() => onRetry(row.id)}
            className="text-xs text-primary underline"
          >
            Retry
          </button>
        </div>
      )}
      {row.status === "success" && row.driveLink && (
        <a
          href={row.driveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary underline"
        >
          Open in Drive
        </a>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: FileRowData["status"] }) {
  if (status === "pending") return <span className="shrink-0 text-xs text-muted-foreground">Pending</span>
  if (status === "uploading") return <span className="shrink-0 text-xs text-primary">Uploading...</span>
  if (status === "success") return <span className="shrink-0 text-xs text-green-600">Done</span>
  if (status === "error") return <span className="shrink-0 text-xs text-destructive">Error</span>
  return null
}
