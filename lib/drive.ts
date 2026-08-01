import { google } from "googleapis"
import { Readable } from "node:stream"
import { CATEGORY_FOLDERS, type Category } from "./constants"

export function createDriveClient(accessToken: string) {
  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
  auth.setCredentials({ access_token: accessToken })
  return google.drive({ version: "v3", auth })
}

let documentsFolderId: string | null = null

export async function resolveUploadFolderId(
  drive: ReturnType<typeof createDriveClient>,
  category: Category,
  year: string,
): Promise<string> {
  if (!documentsFolderId) {
    const docsRes = await drive.files.list({
      q: `name='${process.env.DRIVE_ROOT_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and 'root' in parents and trashed=false`,
      fields: "files(id, name)",
      pageSize: 1,
    })

    if (!docsRes.data.files?.length) {
      throw new Error(`Folder "${process.env.DRIVE_ROOT_FOLDER_NAME}" not found in Drive root`)
    }
    documentsFolderId = docsRes.data.files[0].id!
  }

  const categoryFolderName = CATEGORY_FOLDERS[category]

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
      name: year,
      mimeType: "application/vnd.google-apps.folder",
      parents: [categoryFolderId],
    },
    fields: "id",
  })

  return createdYear.data.id!
}

export async function uploadFileToDrive(
  drive: ReturnType<typeof createDriveClient>,
  folderId: string,
  filename: string,
  fileBuffer: ArrayBuffer,
  mimeType: string,
) {
  const nodeStream = Readable.from(Buffer.from(fileBuffer))

  const response = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId],
    },
    media: {
      mimeType: mimeType || "application/octet-stream",
      body: nodeStream,
    },
    fields: "id, name, webViewLink",
  })

  return response.data
}
