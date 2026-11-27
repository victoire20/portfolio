export type GalleryUsage = {
  table: string
  recordId: number | string
  label: string
  field: string
}

export type CloudinaryGalleryAsset = {
  publicId: string
  assetId: string
  secureUrl: string
  bytes: number
  width: number
  height: number
  format: string
  createdAt: string
  usages: GalleryUsage[]
}

export type CloudinaryGalleryPage = {
  assets: CloudinaryGalleryAsset[]
  nextCursor: string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readAsset(value: unknown): CloudinaryGalleryAsset {
  if (!isRecord(value) || !Array.isArray(value.usages)) {
    throw new Error('The Cloudinary gallery returned invalid image data.')
  }
  const { publicId, assetId, secureUrl, bytes, width, height, format, createdAt } = value
  if (
    typeof publicId !== 'string'
    || typeof assetId !== 'string'
    || typeof secureUrl !== 'string'
    || typeof bytes !== 'number'
    || typeof width !== 'number'
    || typeof height !== 'number'
    || typeof format !== 'string'
    || typeof createdAt !== 'string'
  ) {
    throw new Error('The Cloudinary gallery returned invalid image details.')
  }

  const usages = value.usages.map((usage): GalleryUsage => {
    if (
      !isRecord(usage)
      || (typeof usage.recordId !== 'number' && typeof usage.recordId !== 'string')
      || typeof usage.table !== 'string'
      || typeof usage.label !== 'string'
      || typeof usage.field !== 'string'
    ) {
      throw new Error('The Cloudinary gallery returned invalid usage details.')
    }
    return {
      table: usage.table,
      recordId: usage.recordId,
      label: usage.label,
      field: usage.field,
    }
  })

  return { publicId, assetId, secureUrl, bytes, width, height, format, createdAt, usages }
}

async function getFunctionErrorMessage(error: { message: string; context?: unknown }) {
  if (error.context instanceof Response) {
    try {
      const body: unknown = await error.context.clone().json()
      if (isRecord(body) && typeof body.error === 'string') return body.error
    } catch {
      return error.message
    }
  }
  return error.message
}

export async function listCloudinaryImages(cursor?: string | null): Promise<CloudinaryGalleryPage> {
  const { supabase } = await import('./supabase')
  const { data, error } = await supabase.functions.invoke<unknown>('cloudinary-gallery', {
    body: { action: 'list', cursor: cursor ?? null },
  })
  if (error) throw new Error(await getFunctionErrorMessage(error))
  if (!isRecord(data) || !Array.isArray(data.assets)) {
    throw new Error('The Cloudinary gallery returned an invalid response.')
  }
  if (data.nextCursor !== null && typeof data.nextCursor !== 'string') {
    throw new Error('The Cloudinary gallery returned an invalid pagination cursor.')
  }
  return {
    assets: data.assets.map(readAsset),
    nextCursor: data.nextCursor,
  }
}

export async function deleteCloudinaryImages(publicIds: string[]) {
  const { supabase } = await import('./supabase')
  const { data, error } = await supabase.functions.invoke<unknown>('cloudinary-gallery', {
    body: { action: 'delete', publicIds },
  })
  if (error) throw new Error(await getFunctionErrorMessage(error))
  if (!isRecord(data) || !Array.isArray(data.deleted)) {
    throw new Error('The Cloudinary gallery returned an invalid delete response.')
  }
  const deleted = data.deleted.filter((publicId): publicId is string => typeof publicId === 'string')
  if (deleted.length !== publicIds.length) {
    throw new Error('Cloudinary did not confirm deletion of every selected image.')
  }
  return deleted
}
