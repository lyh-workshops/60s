import process from 'node:process'
import type { NoteMetadata } from 'crossbell'
import { createIndexer } from 'crossbell'
import { ipfsUploadFile } from 'crossbell/ipfs'

export async function uploadPhotosToXLog(photoUrlList: string[]): Promise<string[]> {
  const attachmentUrlList = []
  for (const photoUrl of photoUrlList) {
    if (photoUrl === '') {
      continue
    }
    const mediaData = await fetch(photoUrl).then(res => res.arrayBuffer())
    const file = new File([mediaData], 'mediaData')
    const url = (await ipfsUploadFile(file)).url
    attachmentUrlList.push(url)
  }
  return attachmentUrlList
}

export async function createShort(title: string, content: string, attachmentUrlList: string[]) {
  if (!process.env.XLOG_TOKEN) {
    throw new Error('invalid XLOG_TOKEN')
  }
  if (!process.env.XLOG_CHARACTER_ID) {
    throw new Error('invalid XLOG_CHARACTER_ID')
  }
  const token = process.env.XLOG_TOKEN
  const characterId = Number(process.env.XLOG_CHARACTER_ID)
  const indexer = createIndexer()
  indexer.siwe.token = token
  const metaData: NoteMetadata = {
    tags: ['short'],
    title,
    content,
    sources: ['xlog'],
    date_published: new Date().toISOString(),
    attributes: [
      {
        value: `${Date.now()}`,
        trait_type: 'xlog_slug',
      },
    ],
    attachments: attachmentUrlList.map(url => ({
      name: 'image',
      address: url,
      mime_type: 'image/png',
    })),
  }
  await indexer.siwe.putNote({
    characterId,
    metadata: metaData,
  })
}
