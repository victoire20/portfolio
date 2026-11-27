import { useEffect, useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import {
  deleteCloudinaryImages,
  listCloudinaryImages,
  type CloudinaryGalleryAsset,
} from '../../utils/cloudinaryGallery'
import '../../components/admin/Sidebar.css'
import './Gallery.css'

type Notification = {
  type: 'success' | 'error'
  message: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

export default function Gallery() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [assets, setAssets] = useState<CloudinaryGalleryAsset[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeAsset, setActiveAsset] = useState<CloudinaryGalleryAsset | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

  useEffect(() => {
    let active = true
    listCloudinaryImages()
      .then((page) => {
        if (!active) return
        setAssets(page.assets)
        setNextCursor(page.nextCursor)
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load Cloudinary images.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!notification) return
    const timer = window.setTimeout(() => setNotification(null), 4500)
    return () => window.clearTimeout(timer)
  }, [notification])

  useEffect(() => {
    if (!activeAsset) return
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setActiveAsset(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [activeAsset])

  function toggleSelected(asset: CloudinaryGalleryAsset) {
    if (asset.usages.length > 0 || deleting) return
    setSelectedIds((current) => current.includes(asset.publicId)
      ? current.filter((id) => id !== asset.publicId)
      : [...current, asset.publicId])
  }

  async function loadMore() {
    if (!nextCursor || loadingMore) return
    setLoadingMore(true)
    setError(null)
    try {
      const page = await listCloudinaryImages(nextCursor)
      setAssets((current) => {
        const existingIds = new Set(current.map((asset) => asset.publicId))
        return [...current, ...page.assets.filter((asset) => !existingIds.has(asset.publicId))]
      })
      setNextCursor(page.nextCursor)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load more images.')
    } finally {
      setLoadingMore(false)
    }
  }

  async function deleteAssets(publicIds: string[]) {
    const selectedAssets = assets.filter((asset) => publicIds.includes(asset.publicId))
    if (selectedAssets.length !== publicIds.length || selectedAssets.some((asset) => asset.usages.length > 0)) {
      setNotification({ type: 'error', message: 'Images used in the database cannot be deleted.' })
      return
    }

    const confirmation = publicIds.length === 1
      ? 'Delete this image from Cloudinary? This cannot be undone.'
      : `Delete these ${publicIds.length} images from Cloudinary? This cannot be undone.`
    if (!window.confirm(confirmation)) return

    setDeleting(true)
    setNotification(null)
    try {
      const deletedIds = await deleteCloudinaryImages(publicIds)
      setAssets((current) => current.filter((asset) => !deletedIds.includes(asset.publicId)))
      setSelectedIds((current) => current.filter((id) => !deletedIds.includes(id)))
      setActiveAsset((current) => (
        current && deletedIds.includes(current.publicId) ? null : current
      ))
      setNotification({
        type: 'success',
        message: `${deletedIds.length} image${deletedIds.length === 1 ? '' : 's'} deleted from Cloudinary.`,
      })
    } catch (deleteError) {
      setNotification({
        type: 'error',
        message: deleteError instanceof Error ? deleteError.message : 'Could not delete the selected images.',
      })
    } finally {
      setDeleting(false)
    }
  }

  const selectedUnusedCount = selectedIds.filter((id) => (
    assets.some((asset) => asset.publicId === id && asset.usages.length === 0)
  )).length

  return (
    <main className="admin-dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <section className="admin-dashboard__content" aria-labelledby="admin-gallery-title">
        <div className="admin-dashboard__topbar">
          <span>Admin</span>
          <span className="admin-dashboard__topbar-divider">/</span>
          <span>Gallery</span>
        </div>

        <div className="admin-gallery" aria-busy={loading || loadingMore || deleting}>
          <header className="admin-gallery__header">
            <div>
              <h1 id="admin-gallery-title">Gallery</h1>
              <p>Manage uploaded Cloudinary images and check where they are used.</p>
            </div>
            <div className="admin-gallery__actions">
              <span>{assets.length} image{assets.length === 1 ? '' : 's'} loaded</span>
              <button
                type="button"
                className="admin-gallery__button admin-gallery__button--danger"
                disabled={selectedUnusedCount === 0 || deleting || selectedUnusedCount > 100}
                onClick={() => deleteAssets(selectedIds)}
              >
                {deleting ? 'Deleting…' : `Delete selected (${selectedUnusedCount})`}
              </button>
            </div>
          </header>

          {selectedUnusedCount > 100 && (
            <p className="admin-gallery__notice" role="status">
              Cloudinary allows up to 100 images per deletion. Reduce your selection to continue.
            </p>
          )}
          {error && <p className="admin-gallery__error" role="alert">{error}</p>}
          {notification && (
            <div className={`admin-gallery__notification admin-gallery__notification--${notification.type}`} role={notification.type === 'error' ? 'alert' : 'status'}>
              <span>{notification.message}</span>
              <button type="button" aria-label="Dismiss notification" onClick={() => setNotification(null)}>×</button>
            </div>
          )}

          {loading && <p className="admin-gallery__state" role="status">Loading Cloudinary images…</p>}
          {!loading && !error && assets.length === 0 && (
            <p className="admin-gallery__state">No images were found in Cloudinary.</p>
          )}

          <div className="admin-gallery__grid">
            {assets.map((asset) => {
              const isUsed = asset.usages.length > 0
              const isSelected = selectedIds.includes(asset.publicId)
              return (
                <article
                  className={`admin-gallery__card${isSelected ? ' is-selected' : ''}`}
                  key={asset.assetId}
                >
                  <div className="admin-gallery__preview">
                    <button
                      type="button"
                      className="admin-gallery__image-button"
                      onClick={() => setActiveAsset(asset)}
                      aria-label={`View details for ${asset.publicId}`}
                    >
                      <img src={asset.secureUrl} alt={asset.publicId} loading="lazy" />
                    </button>
                    <span className={`admin-gallery__status admin-gallery__status--${isUsed ? 'used' : 'unused'}`}>
                      {isUsed ? 'Used' : 'Unused'}
                    </span>
                    <label className="admin-gallery__select">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isUsed || deleting}
                        onChange={() => toggleSelected(asset)}
                        aria-label={`Select ${asset.publicId}`}
                      />
                      <span className="admin-gallery__visually-hidden">Select image</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    className="admin-gallery__path"
                    onClick={() => setActiveAsset(asset)}
                    title={asset.publicId}
                  >
                    {asset.publicId}
                  </button>
                  <p className="admin-gallery__meta">{asset.width} × {asset.height} · {formatBytes(asset.bytes)}</p>
                </article>
              )
            })}
          </div>

          {nextCursor && (
            <div className="admin-gallery__load-more">
              <button type="button" className="admin-gallery__button" disabled={loadingMore} onClick={loadMore}>
                {loadingMore ? 'Loading…' : 'Load more images'}
              </button>
            </div>
          )}
        </div>
      </section>

      {activeAsset && (
        <div className="admin-gallery__drawer-layer">
          <button
            type="button"
            className="admin-gallery__backdrop"
            aria-label="Close image details"
            onClick={() => setActiveAsset(null)}
          />
          <aside
            className="admin-gallery__drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-gallery-drawer-title"
          >
            <header className="admin-gallery__drawer-header">
              <div>
                <p>Image details</p>
                <h2 id="admin-gallery-drawer-title">{activeAsset.publicId}</h2>
              </div>
              <button type="button" aria-label="Close image details" onClick={() => setActiveAsset(null)}>×</button>
            </header>
            <img className="admin-gallery__detail-image" src={activeAsset.secureUrl} alt={activeAsset.publicId} />
            <dl className="admin-gallery__details">
              <div>
                <dt>Cloudinary path</dt>
                <dd>{activeAsset.publicId}</dd>
              </div>
              <div>
                <dt>File size</dt>
                <dd>{formatBytes(activeAsset.bytes)} ({activeAsset.bytes.toLocaleString()} bytes)</dd>
              </div>
              <div>
                <dt>Image dimensions</dt>
                <dd>{activeAsset.width} × {activeAsset.height} px</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>{activeAsset.format.toUpperCase()}</dd>
              </div>
              <div>
                <dt>Uploaded</dt>
                <dd>{formatDate(activeAsset.createdAt)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span className={`admin-gallery__status admin-gallery__status--${activeAsset.usages.length ? 'used' : 'unused'}`}>
                    {activeAsset.usages.length ? 'Used' : 'Unused'}
                  </span>
                </dd>
              </div>
            </dl>

            <section className="admin-gallery__usage">
              <h3>Where it is used</h3>
              {activeAsset.usages.length === 0
                ? <p>This image is not referenced by any project record.</p>
                : (
                  <ul>
                    {activeAsset.usages.map((usage) => (
                      <li key={`${usage.table}-${usage.recordId}-${usage.field}`}>
                        <strong>{usage.label}</strong>
                        <span>{usage.table} · {usage.field} · ID {usage.recordId}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </section>

            <footer className="admin-gallery__drawer-footer">
              <a href={activeAsset.secureUrl} target="_blank" rel="noreferrer">Open original image</a>
              {activeAsset.usages.length === 0
                ? (
                  <button
                    type="button"
                    className="admin-gallery__button admin-gallery__button--danger"
                    disabled={deleting}
                    onClick={() => deleteAssets([activeAsset.publicId])}
                  >
                    {deleting ? 'Deleting…' : 'Delete image'}
                  </button>
                )
                : <p>Images used in a database record cannot be deleted.</p>}
            </footer>
          </aside>
        </div>
      )}
    </main>
  )
}
