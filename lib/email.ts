import { google } from "googleapis"
import { createDriveClient } from "./drive"
import { CATEGORY_FOLDERS } from "./constants"

export const MIYU_RECIPIENTS = [
  "sieyuen87@gmail.com",
  "carynchansrealestate@gmail.com",
]

export interface MiyuEmailPreview {
  monthName: string
  monthNumber: number
  monthAbbrev: string
  year: number
  subject: string
  recipients: string[]
  expectedFiles: Array<{ title: string; fileName: string }>
  matchedFiles: Array<{
    title: string
    fileName: string
    id: string
    webViewLink?: string | null
  }>
  isReady: boolean
  message: string
}

export function getCurrentMonthContext(date = new Date()) {
  const monthNumber = date.getMonth() + 1
  const monthName = date.toLocaleString("en-US", { month: "long" })
  const monthAbbrev = date.toLocaleString("en-US", { month: "short" })
  const year = date.getFullYear()

  return {
    monthName,
    monthNumber,
    monthAbbrev,
    year,
    subject: `12-02 Miyu - Rent and bills for ${monthName} ${year}`,
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export async function getMiyuEmailPreview(
  accessToken: string,
  date = new Date()
): Promise<MiyuEmailPreview> {
  const drive = createDriveClient(accessToken)
  const { monthName, monthNumber, monthAbbrev, year, subject } =
    getCurrentMonthContext(date)

  const folderId = await resolveMiyuFolderId(drive, year)

  const filesRes = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "files(id,name,mimeType,webViewLink)",
    pageSize: 100,
  })

  const expectedFiles = ["Rent", "Water", "TNB"].map((title) => ({
    title,
    fileName: `${monthNumber}. ${title} - ${monthAbbrev} ${year}`,
  }))

  const matchedFiles = expectedFiles.flatMap(({ title, fileName }) => {
    const pattern = new RegExp(
      `^${monthNumber}\\.\\s*${escapeRegExp(title)}\\s*-\\s*${escapeRegExp(monthAbbrev)}\\s+${year}\\b`,
      "i"
    )
    const match = filesRes.data.files?.find(
      (file) => file.name && pattern.test(file.name)
    )

    if (!match) {
      return []
    }

    return [
      {
        title,
        fileName: match.name ?? fileName,
        id: match.id ?? "",
        webViewLink: match.webViewLink,
      },
    ]
  })

  const isReady = matchedFiles.length === expectedFiles.length
  const message = isReady
    ? "All receipts are ready to send."
    : "You need to upload receipts to Google Drive first."

  return {
    monthName,
    monthNumber,
    monthAbbrev,
    year,
    subject,
    recipients: MIYU_RECIPIENTS,
    expectedFiles,
    matchedFiles,
    isReady,
    message,
  }
}

async function resolveMiyuFolderId(
  drive: ReturnType<typeof createDriveClient>,
  year: number
) {
  const docsRes = await drive.files.list({
    q: `name='${process.env.DRIVE_ROOT_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false`,
    fields: "files(id, name)",
    pageSize: 1,
  })

  if (!docsRes.data.files?.length) {
    throw new Error(
      `Folder "${process.env.DRIVE_ROOT_FOLDER_NAME}" not found in Drive root`
    )
  }

  const documentsFolderId = docsRes.data.files[0].id!
  const categoryFolderName = CATEGORY_FOLDERS.miyu

  const categoryRes = await drive.files.list({
    q: `name='${categoryFolderName}' and mimeType='application/vnd.google-apps.folder' and '${documentsFolderId}' in parents and trashed=false`,
    fields: "files(id, name)",
    pageSize: 1,
  })

  let categoryFolderId: string
  if (categoryRes.data.files?.length) {
    categoryFolderId = categoryRes.data.files[0].id!
  } else {
    const created = await drive.files.create({
      requestBody: {
        name: categoryFolderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [documentsFolderId],
      },
      fields: "id",
    })
    categoryFolderId = created.data.id!
  }

  const yearRes = await drive.files.list({
    q: `name='${year}' and mimeType='application/vnd.google-apps.folder' and '${categoryFolderId}' in parents and trashed=false`,
    fields: "files(id, name)",
    pageSize: 1,
  })

  if (yearRes.data.files?.length) {
    return yearRes.data.files[0].id!
  }

  const createdYear = await drive.files.create({
    requestBody: {
      name: String(year),
      mimeType: "application/vnd.google-apps.folder",
      parents: [categoryFolderId],
    },
    fields: "id",
  })

  return createdYear.data.id!
}

export async function sendMiyuEmail(
  accessToken: string,
  senderEmail: string,
  date = new Date()
) {
  const drive = createDriveClient(accessToken)
  const preview = await getMiyuEmailPreview(accessToken, date)

  if (!preview.isReady) {
    throw new Error(preview.message)
  }

  const attachments = await Promise.all(
    preview.matchedFiles.map(async (file) => {
      const metadata = await drive.files.get(
        { fileId: file.id, alt: "media" },
        { responseType: "arraybuffer" }
      )
      const buffer = Buffer.from(metadata.data as ArrayBuffer)
      return {
        filename: file.fileName,
        mimeType: "application/octet-stream",
        contentBase64: buffer.toString("base64"),
      }
    })
  )

  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
  auth.setCredentials({ access_token: accessToken })

  const gmail = google.gmail({ version: "v1", auth })
  const boundary = `boundary_${Date.now()}`

  const messageParts = [
    `From: ${senderEmail}`,
    `To: ${preview.recipients.join(", ")}`,
    `Subject: ${preview.subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    "",
  ]

  for (const attachment of attachments) {
    messageParts.push(
      `--${boundary}`,
      `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"`,
      "Content-Transfer-Encoding: base64",
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      "",
      attachment.contentBase64,
      ""
    )
  }

  messageParts.push(`--${boundary}--`)

  const message = messageParts.join("\r\n")
  const encoded = Buffer.from(message).toString("base64url")

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encoded,
    },
  })

  return {
    success: true,
    messageId: response.data.id,
    subject: preview.subject,
  }
}
