export type UploadStatus = "pending" | "uploading" | "success" | "error"

export interface FileRowData {
  id: string
  file: File
  originalName: string
  ext: string
  targetName: string
  status: UploadStatus
  error?: string
  driveFileId?: string
  driveLink?: string
}

export interface UploadResponse {
  success: boolean
  file?: {
    id: string
    name: string
    webViewLink: string
  }
  error?: string
}
