import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json',
}

const galleryAssetFolder = 'assets/images'
const galleryPublicIdPrefix = 'assets/images/'

type CloudinaryAsset = {
  public_id: string
  asset_id: string
  secure_url: string
  bytes: number
  width: number
  height: number
  format: string
  created_at: string
}

type ProjectUsageRecord = {
  id: unknown
  title: unknown
  cover: unknown
  maquette: unknown
}

type AssetUsage = {
  table: string
  recordId: number | string
  label: string
  field: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders })
}

function publicIdFromReference(reference: string) {
  try {
    const url = new URL(reference)
    const marker = '/upload/'
    const markerIndex = url.pathname.indexOf(marker)
    if (markerIndex < 0) return null

    const path = url.pathname.slice(markerIndex + marker.length)
    const segments = path.split('/').filter(Boolean)
    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment))
    const assetSegments = versionIndex >= 0
      ? segments.slice(versionIndex + 1)
      : segments[0]?.includes(',')
        ? segments.slice(1)
        : segments
    const publicId = assetSegments.join('/').replace(/\.[^/.]+$/, '')
    return publicId || null
  } catch {
    return null
  }
}

function projectReferences(project: ProjectUsageRecord) {
  const references: { path: string; field: string }[] = []
  if (typeof project.cover === 'string' && project.cover.trim()) {
    references.push({ path: project.cover, field: 'cover' })
  }
  if (isRecord(project.maquette) && typeof project.maquette.url === 'string' && project.maquette.url.trim()) {
    references.push({ path: project.maquette.url, field: 'maquette.url' })
  }
  return references
}

function referenceMatchesAsset(reference: string, asset: CloudinaryAsset) {
  return reference === asset.secure_url
    || reference === asset.public_id
    || publicIdFromReference(reference) === asset.public_id
}

async function loadProjectRecords(supabase: ReturnType<typeof createClient>) {
  const { data, error } = await supabase
    .from('projects')
    .select('id, title, cover, maquette')
    .overrideTypes<ProjectUsageRecord[]>()
  if (error) throw new Error(`Could not check project image usage: ${error.message}`)
  return data ?? []
}

function getAssetUsages(asset: CloudinaryAsset, projects: ProjectUsageRecord[]): AssetUsage[] {
  const usages: AssetUsage[] = []
  for (const project of projects) {
    if (
      (typeof project.id !== 'string' && typeof project.id !== 'number')
      || typeof project.title !== 'string'
    ) {
      throw new Error('The projects table contains invalid image usage data.')
    }

    for (const reference of projectReferences(project)) {
      if (referenceMatchesAsset(reference.path, asset)) {
        usages.push({
          table: 'projects',
          recordId: project.id,
          label: project.title,
          field: reference.field,
        })
      }
    }
  }
  return usages
}

function getCloudinaryCredentials() {
  const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME')
  const apiKey = Deno.env.get('CLOUDINARY_API_KEY')
  const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET')
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary gallery secrets are not configured on the server.')
  }
  return {
    cloudName,
    authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
  }
}

async function cloudinaryErrorMessage(response: Response) {
  try {
    const body: unknown = await response.json()
    if (isRecord(body) && isRecord(body.error) && typeof body.error.message === 'string') {
      return body.error.message
    }
  } catch {
    return `Cloudinary returned HTTP ${response.status}.`
  }
  return `Cloudinary returned HTTP ${response.status}.`
}

async function handleList(
  supabase: ReturnType<typeof createClient>,
  cloudName: string,
  authorization: string,
  cursor: unknown,
) {
  if (cursor !== null && cursor !== undefined && (
    typeof cursor !== 'string' || cursor.length > 2048
  )) {
    return jsonResponse({ error: 'Invalid Cloudinary pagination cursor.' }, 400)
  }

  const folderUrl = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder`)
  folderUrl.searchParams.set('asset_folder', galleryAssetFolder)
  folderUrl.searchParams.set('max_results', '100')
  folderUrl.searchParams.set('fields', 'public_id,asset_id,secure_url,bytes,width,height,format,created_at,asset_folder,resource_type,type')
  if (typeof cursor === 'string' && cursor) folderUrl.searchParams.set('next_cursor', cursor)

  let response = await fetch(folderUrl, { headers: { Authorization: authorization } })
  let usingFixedFolderModeFallback = false
  if (response.status === 404) {
    usingFixedFolderModeFallback = true
    const prefixUrl = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`)
    prefixUrl.searchParams.set('prefix', galleryPublicIdPrefix)
    prefixUrl.searchParams.set('max_results', '100')
    prefixUrl.searchParams.set('fields', 'public_id,asset_id,secure_url,bytes,width,height,format,created_at,resource_type,type')
    if (typeof cursor === 'string' && cursor) prefixUrl.searchParams.set('next_cursor', cursor)
    response = await fetch(prefixUrl, { headers: { Authorization: authorization } })
  }
  if (!response.ok) {
    return jsonResponse({ error: `Could not list Cloudinary images: ${await cloudinaryErrorMessage(response)}` }, 502)
  }

  const result: unknown = await response.json()
  if (!isRecord(result) || !Array.isArray(result.resources)) {
    return jsonResponse({ error: 'Cloudinary returned an invalid resources response.' }, 502)
  }

  const projects = await loadProjectRecords(supabase)
  const matchingResources = result.resources.filter((resource) => (
    isRecord(resource)
    && resource.resource_type === 'image'
    && resource.type === 'upload'
    && (
      usingFixedFolderModeFallback
      || (
        typeof resource.asset_folder === 'string'
        && resource.asset_folder.toLowerCase() === galleryAssetFolder
      )
    )
  ))
  const resources = matchingResources.map((resource): CloudinaryAsset => {
    if (
      !isRecord(resource)
      || typeof resource.public_id !== 'string'
      || typeof resource.asset_id !== 'string'
      || typeof resource.secure_url !== 'string'
      || typeof resource.bytes !== 'number'
      || typeof resource.width !== 'number'
      || typeof resource.height !== 'number'
      || typeof resource.format !== 'string'
      || typeof resource.created_at !== 'string'
    ) {
      throw new Error('Cloudinary returned invalid image details.')
    }
    return resource as CloudinaryAsset
  })

  return jsonResponse({
    assets: resources.map((asset) => ({
      publicId: asset.public_id,
      assetId: asset.asset_id,
      secureUrl: asset.secure_url,
      bytes: asset.bytes,
      width: asset.width,
      height: asset.height,
      format: asset.format,
      createdAt: asset.created_at,
      usages: getAssetUsages(asset, projects),
    })),
    nextCursor: typeof result.next_cursor === 'string' ? result.next_cursor : null,
  })
}

async function handleDelete(
  supabase: ReturnType<typeof createClient>,
  cloudName: string,
  authorization: string,
  publicIdsValue: unknown,
) {
  if (
    !Array.isArray(publicIdsValue)
    || publicIdsValue.length === 0
    || publicIdsValue.length > 100
    || publicIdsValue.some((id) => typeof id !== 'string' || !id.trim() || id.length > 500)
  ) {
    return jsonResponse({ error: 'Select between 1 and 100 valid image paths to delete.' }, 400)
  }

  const publicIds = [...new Set(publicIdsValue as string[])]
  const resourceUrl = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`)
  resourceUrl.searchParams.set('fields', 'public_id,asset_folder,resource_type,type')
  for (const publicId of publicIds) resourceUrl.searchParams.append('public_ids[]', publicId)

  const resourceResponse = await fetch(resourceUrl, { headers: { Authorization: authorization } })
  if (!resourceResponse.ok) {
    return jsonResponse({
      error: `Could not verify the selected Cloudinary images: ${await cloudinaryErrorMessage(resourceResponse)}`,
    }, 502)
  }
  const resourceResult: unknown = await resourceResponse.json()
  const resources = isRecord(resourceResult) && Array.isArray(resourceResult.resources)
    ? resourceResult.resources
    : []
  const validPublicIds = new Set<string>()
  for (const resource of resources) {
    if (
      !isRecord(resource)
      || typeof resource.public_id !== 'string'
      || resource.resource_type !== 'image'
      || resource.type !== 'upload'
    ) {
      continue
    }

    const inGalleryFolder = (
      typeof resource.asset_folder === 'string'
      && resource.asset_folder.toLowerCase() === galleryAssetFolder
    ) || resource.public_id.startsWith(galleryPublicIdPrefix)
    if (inGalleryFolder) validPublicIds.add(resource.public_id)
  }
  const invalidPublicIds = publicIds.filter((publicId) => !validPublicIds.has(publicId))
  if (invalidPublicIds.length > 0) {
    return jsonResponse({
      error: 'Only uploaded images in the assets/images folder can be deleted from this gallery.',
      invalid: invalidPublicIds,
    }, 400)
  }

  const projects = await loadProjectRecords(supabase)
  const usagesByPublicId = new Map<string, AssetUsage[]>()
  for (const project of projects) {
    if (
      (typeof project.id !== 'string' && typeof project.id !== 'number')
      || typeof project.title !== 'string'
    ) {
      throw new Error('The projects table contains invalid image usage data.')
    }
    for (const reference of projectReferences(project)) {
      const publicId = publicIdFromReference(reference.path) ?? reference.path
      if (!publicIds.includes(publicId)) continue
      const usages = usagesByPublicId.get(publicId) ?? []
      usages.push({
        table: 'projects',
        recordId: project.id,
        label: project.title,
        field: reference.field,
      })
      usagesByPublicId.set(publicId, usages)
    }
  }

  if (usagesByPublicId.size > 0) {
    return jsonResponse({
      error: 'Some selected images are still used in the database and cannot be deleted.',
      used: [...usagesByPublicId.keys()],
    }, 409)
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`
  const form = new URLSearchParams()
  for (const publicId of publicIds) form.append('public_ids[]', publicId)

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form,
  })
  if (!response.ok) {
    return jsonResponse({ error: `Could not delete Cloudinary images: ${await cloudinaryErrorMessage(response)}` }, 502)
  }

  const result: unknown = await response.json()
  const deletedMap = isRecord(result) && isRecord(result.deleted) ? result.deleted : null
  if (!deletedMap) return jsonResponse({ error: 'Cloudinary returned an invalid delete response.' }, 502)

  const failedIds = publicIds.filter((publicId) => (
    deletedMap[publicId] !== 'deleted' && deletedMap[publicId] !== 'not_found'
  ))
  if (failedIds.length > 0) {
    return jsonResponse({ error: `Cloudinary could not delete: ${failedIds.join(', ')}.` }, 502)
  }

  return jsonResponse({ deleted: publicIds })
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405)

  try {
    const authorization = request.headers.get('Authorization')
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
    if (!authorization || !token) return jsonResponse({ error: 'Authentication is required.' }, 401)

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ error: 'Supabase function environment is not configured.' }, 500)
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) return jsonResponse({ error: 'Your admin session is invalid or expired.' }, 401)

    const credentials = getCloudinaryCredentials()
    const body: unknown = await request.json()
    if (!isRecord(body)) return jsonResponse({ error: 'Invalid request body.' }, 400)

    if (body.action === 'list') {
      return await handleList(supabase, credentials.cloudName, credentials.authorization, body.cursor)
    }
    if (body.action === 'delete') {
      return await handleDelete(supabase, credentials.cloudName, credentials.authorization, body.publicIds)
    }
    return jsonResponse({ error: 'Unsupported gallery action.' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected gallery server error.'
    return jsonResponse({ error: message }, 500)
  }
})
