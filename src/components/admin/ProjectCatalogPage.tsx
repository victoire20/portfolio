import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  skillCategoryFallbacks,
  skillCategoryTranslationKeys,
  type SkillCategory,
} from '../../types/skill'
import Sidebar from './Sidebar'
import './Sidebar.css'
import './ProjectCatalogPage.css'

export type CatalogStatus = 'Enabled' | 'Disabled'

export type CatalogTranslation = {
  label: string
  description: string
}

export type CatalogTranslations = {
  fr: CatalogTranslation
  en: CatalogTranslation
}

export type CatalogItem = {
  id: number | string
  label: string
  description: string
  status?: CatalogStatus
  translations?: CatalogTranslations
  type?: SkillCategory
}

type CatalogDraft = {
  id: number | string | null
  label: string
  description: string
  englishLabel: string
  englishDescription: string
  type: string
  status: CatalogStatus
}

type ProjectCatalogPageProps = {
  title: string
  description: string
  initialItems: CatalogItem[]
  showDescription?: boolean
  showTranslations?: boolean
  contentOnly?: boolean
  showStatus?: boolean
  showStatusFilter?: boolean
  showTypeFilter?: boolean
  allowBulkCreate?: boolean
  categories?: readonly SkillCategory[]
  loading?: boolean
  loadError?: string | null
  onCreate: (item: Omit<CatalogItem, 'id'>) => Promise<CatalogItem>
  onCreateMany?: (items: Omit<CatalogItem, 'id'>[]) => Promise<CatalogItem[]>
  onUpdate: (id: CatalogItem['id'], item: Omit<CatalogItem, 'id'>) => Promise<CatalogItem>
  onSetActive: (id: CatalogItem['id'], isActive: boolean) => Promise<CatalogItem>
  onDelete: (id: CatalogItem['id']) => Promise<void>
}

const pageSizes = [5, 10, 20]

type Notification = {
  type: 'success' | 'error'
  message: string
}

export default function ProjectCatalogPage({
  title,
  description,
  initialItems,
  showDescription = true,
  showTranslations = true,
  contentOnly = false,
  showStatus = true,
  showStatusFilter = showStatus,
  showTypeFilter: showTypeFilterProp,
  allowBulkCreate = false,
  categories,
  loading = false,
  loadError = null,
  onCreate,
  onCreateMany,
  onUpdate,
  onSetActive,
  onDelete,
}: ProjectCatalogPageProps) {
  const showTypeFilter = showTypeFilterProp ?? Boolean(categories)
  const { i18n, t } = useTranslation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [items, setItems] = useState<CatalogItem[]>(() => [...initialItems])
  const [draft, setDraft] = useState<CatalogDraft | null>(null)
  const [openMenuId, setOpenMenuId] = useState<CatalogItem['id'] | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [saving, setSaving] = useState(false)
  const [pendingItemId, setPendingItemId] = useState<CatalogItem['id'] | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | CatalogStatus>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | SkillCategory>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filteredItems = items.filter((item) => {
    const query = search.trim().toLowerCase()
    const text = getLocalizedText(item, i18n.language, showTranslations)
    return text.label.toLowerCase().includes(query)
      || (showDescription && text.description.toLowerCase().includes(query))
      || Boolean(categories && item.type?.includes(query))
  }).filter((item) => (
    statusFilter === 'all' || item.status === statusFilter
  )).filter((item) => (
    typeFilter === 'all' || item.type === typeFilter
  ))
  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const firstItemIndex = filteredItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastItemIndex = Math.min(currentPage * pageSize, filteredItems.length)
  const visibleItems = filteredItems.slice(firstItemIndex - (filteredItems.length ? 1 : 0), currentPage * pageSize)

  useEffect(() => {
    if (!notification) return
    const timer = window.setTimeout(() => setNotification(null), 4000)
    return () => window.clearTimeout(timer)
  }, [notification])

  function notify(type: Notification['type'], message: string) {
    setNotification({ type, message })
  }

  function openCreateModal() {
    setDraft({
      id: null,
      label: '',
      description: '',
      englishLabel: '',
      englishDescription: '',
      type: categories?.[0] ?? '',
      status: 'Enabled',
    })
  }

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft || saving) return

    const labels = allowBulkCreate && draft.id === null
      ? draft.label.split('\n').map((label) => label.trim()).filter(Boolean)
      : [draft.label.trim()]
    const label = labels[0] ?? ''
    const itemDescription = draft.description.trim()
    const englishLabel = showTranslations ? draft.englishLabel.trim() : ''
    const englishDescription = showTranslations ? draft.englishDescription.trim() : ''

    if (!label) {
      notify('error', contentOnly ? 'Content is required.' : 'A label is required.')
      return
    }
    if (categories && !categories.includes(draft.type as SkillCategory)) {
      notify('error', 'Select a valid category.')
      return
    }

    const submittedLabels = new Set<string>()
    const duplicateSubmitted = labels.some((value) => {
      const normalized = value.toLowerCase()
      if (submittedLabels.has(normalized)) return true
      submittedLabels.add(normalized)
      return false
    })
    const duplicate = duplicateSubmitted || labels.some((value) => items.some((item) => {
      if (item.id === draft.id) return false
      const currentEnglishLabel = showTranslations
        ? item.translations?.en.label.trim().toLowerCase()
        : undefined
      return item.label.trim().toLowerCase() === value.toLowerCase()
        || Boolean(englishLabel && currentEnglishLabel === englishLabel.toLowerCase())
    }))
    if (duplicate) {
      notify('error', 'An item with this label already exists.')
      return
    }

    setSaving(true)
    try {
      const createValues = labels.map((itemLabel) => ({
        label: itemLabel,
        description: itemDescription,
        ...(showStatus ? { status: draft.status } : {}),
        ...(categories ? { type: draft.type as SkillCategory } : {}),
        ...(showTranslations ? { translations: {
          fr: { label: itemLabel, description: itemDescription },
          en: { label: englishLabel, description: englishDescription },
        } } : {}),
      }))
      const savedItems = draft.id === null
        ? allowBulkCreate
          ? await (onCreateMany
            ? onCreateMany(createValues)
            : Promise.all(createValues.map((value) => onCreate(value))))
          : [await onCreate(createValues[0])]
        : [await onUpdate(draft.id, createValues[0])]

      setItems((current) => draft.id === null
        ? [...savedItems, ...current]
        : current.map((item) => item.id === savedItems[0].id ? savedItems[0] : item))
      if (draft.id === null) {
        setPage(1)
        setDraft({
          id: null,
          label: '',
          description: '',
          englishLabel: '',
          englishDescription: '',
          type: categories?.[0] ?? '',
          status: 'Enabled',
        })
        notify('success', `${savedItems.length} ${savedItems.length === 1 ? 'item' : 'items'} added successfully.`)
      } else {
        notify('success', 'Item updated successfully.')
        setDraft(null)
      }
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Could not save the item.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(item: CatalogItem) {
    setPendingItemId(item.id)
    setOpenMenuId(null)
    try {
      const updatedItem = await onSetActive(item.id, item.status !== 'Enabled')
      setItems((current) => current.map((entry) => entry.id === updatedItem.id ? updatedItem : entry))
      notify('success', `Status changed to ${updatedItem.status?.toLowerCase() ?? 'unknown'}.`)
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Could not update the status.')
    } finally {
      setPendingItemId(null)
    }
  }

  async function deleteItem(item: CatalogItem) {
    setPendingItemId(item.id)
    setOpenMenuId(null)
    try {
      await onDelete(item.id)
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      notify('success', 'Item deleted successfully.')
    } catch (error) {
      notify('error', error instanceof Error ? error.message : 'Could not delete the item.')
    } finally {
      setPendingItemId(null)
    }
  }

  return (
    <main className="admin-dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <section className="admin-dashboard__content" aria-labelledby="catalog-page-title">
        <div className="admin-dashboard__topbar">
          <span>Admin</span>
          <span className="admin-dashboard__topbar-divider">/</span>
          <span>{title}</span>
        </div>
        <div className="catalog-page">
          <header className="catalog-page__header">
            <div>
              <h1 id="catalog-page-title">{title}</h1>
              <p>{description}</p>
            </div>
            <button className="catalog-page__primary-button" type="button" onClick={openCreateModal}>
              <span aria-hidden="true">+</span>
              Add {title.toLowerCase().replace(/s$/, '')}
            </button>
          </header>

          {loadError && (
            <p className="catalog-page__load-error" role="alert">
              Could not load {title.toLowerCase()}: {loadError}
            </p>
          )}

          <div className="catalog-table">
            <div className="catalog-table__toolbar">
              <label className="catalog-table__search">
                <span className="catalog-page__visually-hidden">Search {title.toLowerCase()}</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>
                <input
                  type="search"
                  placeholder={`Filter ${title.toLowerCase()}...`}
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setPage(1)
                  }}
                />
              </label>
              <div className="catalog-table__filters">
                {showTypeFilter && categories && (
                  <label>
                    <span className="catalog-page__visually-hidden">Filter by type</span>
                    <select value={typeFilter} onChange={(event) => {
                      setTypeFilter(event.target.value as 'all' | SkillCategory)
                      setPage(1)
                    }}>
                      <option value="all">All types</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {t(skillCategoryTranslationKeys[category], {
                            defaultValue: skillCategoryFallbacks[category],
                          })}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {showStatusFilter && (
                  <label>
                    <span className="catalog-page__visually-hidden">Filter by status</span>
                    <select value={statusFilter} onChange={(event) => {
                      setStatusFilter(event.target.value as 'all' | CatalogStatus)
                      setPage(1)
                    }}>
                      <option value="all">All statuses</option>
                      <option value="Enabled">Enabled</option>
                      <option value="Disabled">Disabled</option>
                    </select>
                  </label>
                )}
              </div>
              <span className="catalog-table__count" aria-live="polite">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="catalog-table__scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{contentOnly ? 'Content' : 'Label'}</th>
                    {showDescription && <th scope="col">Description</th>}
                    {categories && <th scope="col">Type</th>}
                    {showStatus && <th scope="col">Status</th>}
                    <th scope="col"><span className="catalog-page__visually-hidden">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item) => (
                    <tr key={item.id}>
                      {contentOnly ? (
                        <td className="catalog-table__content-translations">
                          {([
                            { code: 'fr', language: 'Français', flag: '🇫🇷', content: item.translations?.fr.label || item.label },
                            { code: 'en', language: 'English', flag: '🇬🇧', content: item.translations?.en.label ?? '' },
                          ] as const)
                            .filter((translation) => translation.content.trim())
                            .map((translation) => (
                              <div className="catalog-table__content-translation" key={translation.code}>
                                <span
                                  className="catalog-table__language-badge"
                                  aria-label={translation.language}
                                  title={translation.language}
                                >
                                  {translation.flag}
                                </span>
                                <span>{translation.content}</span>
                              </div>
                            ))}
                        </td>
                      ) : (
                        <td className="catalog-table__label">{getLocalizedText(item, i18n.language, showTranslations).label}</td>
                      )}
                      {showDescription && (
                        <td className="catalog-table__description">{getLocalizedText(item, i18n.language, showTranslations).description}</td>
                      )}
                      {categories && <td>{item.type}</td>}
                      {showStatus && <td>
                        <span className={`catalog-table__status catalog-table__status--${(item.status ?? 'Enabled').toLowerCase()}`}>
                          <span aria-hidden="true" />
                          {item.status ?? 'Enabled'}
                        </span>
                      </td>}
                      <td className="catalog-table__actions-cell">
                        <div className="catalog-table__actions">
                          <button
                            type="button"
                            className="catalog-table__more"
                            aria-label={`Actions for ${item.label}`}
                            aria-haspopup="menu"
                            aria-expanded={openMenuId === item.id}
                            disabled={pendingItemId !== null}
                            onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                          >
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <circle cx="5" cy="12" r="1" />
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="19" cy="12" r="1" />
                            </svg>
                          </button>
                          {openMenuId === item.id && (
                            <div className="catalog-table__menu" role="menu">
                              <button type="button" role="menuitem" disabled={pendingItemId !== null} onClick={() => {
                                setDraft({
                                  id: item.id,
                                  label: item.label,
                                  description: item.description,
                                  englishLabel: showTranslations ? item.translations?.en.label ?? '' : '',
                                  englishDescription: showTranslations ? item.translations?.en.description ?? '' : '',
                                  type: item.type ?? categories?.[0] ?? '',
                                  status: item.status ?? 'Enabled',
                                })
                                setOpenMenuId(null)
                              }}>
                                Edit
                              </button>
                              {showStatus && <button type="button" role="menuitem" disabled={pendingItemId !== null} onClick={() => toggleStatus(item)}>
                                {item.status === 'Enabled' ? 'Disable' : 'Enable'}
                              </button>}
                              <button
                                type="button"
                                className="catalog-table__menu-delete"
                                role="menuitem"
                                disabled={pendingItemId !== null}
                                onClick={() => deleteItem(item)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {visibleItems.length === 0 && (
                    <tr>
                      <td
                        className="catalog-table__empty"
                        colSpan={1 + Number(showDescription) + Number(Boolean(categories)) + Number(showStatus) + 1}
                      >
                        {loading
                          ? `Loading ${title.toLowerCase()}...`
                          : loadError
                            ? 'The items could not be loaded.'
                            : items.length === 0
                              ? 'No items yet. Add one to get started.'
                              : 'No items found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="catalog-table__footer">
              <p>
                {loading
                  ? `Loading ${title.toLowerCase()}...`
                  : loadError
                    ? 'Items unavailable'
                    : filteredItems.length === 0
                      ? 'No items to display'
                  : `Showing ${firstItemIndex}–${lastItemIndex} of ${filteredItems.length} items`}
              </p>
              <div className="catalog-table__pagination">
                <label>
                  Rows per page
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value))
                      setPage(1)
                    }}
                  >
                    {pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </label>
                <span>Page {currentPage} of {pageCount}</span>
                <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
                  Previous
                </button>
                <button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>
                  Next
                </button>
              </div>
            </footer>
          </div>
        </div>
      </section>

      {draft && (
        <div
          className="catalog-modal__overlay"
          onMouseDown={(event) => {
            if (!saving && event.target === event.currentTarget) setDraft(null)
          }}
        >
          <section className="catalog-modal" role="dialog" aria-modal="true" aria-labelledby="catalog-modal-title">
            <header>
              <div>
                <h2 id="catalog-modal-title">{draft.id === null ? `Add ${title.toLowerCase().replace(/s$/, '')}` : `Edit ${title.toLowerCase().replace(/s$/, '')}`}</h2>
                <p>{contentOnly
                  ? 'Enter the content in French and English.'
                  : showDescription
                  ? 'Enter a label, a short description, and its status.'
                  : categories
                    ? 'Enter a skill and select its category.'
                    : 'Enter a label and its status.'}</p>
              </div>
              <button type="button" className="catalog-modal__close" aria-label="Close" onClick={() => {
                if (!saving) setDraft(null)
              }} disabled={saving}>
                ×
              </button>
            </header>
            <form onSubmit={saveItem}>
              <label>
                {contentOnly ? 'Content (French)' : showTranslations ? 'Label (French)' : allowBulkCreate && draft.id === null ? 'Labels (one per line)' : 'Label'}
                {allowBulkCreate && draft.id === null ? (
                  <textarea
                    autoFocus
                    rows={5}
                    value={draft.label}
                    onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                    placeholder="Enter one skill per line"
                    disabled={saving}
                  />
                ) : (
                  <input
                    autoFocus
                    value={draft.label}
                    onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                    placeholder={contentOnly ? 'Enter content' : 'Enter a label'}
                    disabled={saving}
                  />
                )}
              </label>
              {showDescription && (
                <label>
                  Brief description (French)
                  <textarea
                    rows={3}
                    value={draft.description}
                    onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                    placeholder="Describe this item briefly"
                    disabled={saving}
                  />
                </label>
              )}
              {categories && (
                <label>
                  Type
                  <select
                    value={draft.type}
                    onChange={(event) => setDraft({ ...draft, type: event.target.value })}
                    disabled={saving}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {t(skillCategoryTranslationKeys[category], {
                          defaultValue: skillCategoryFallbacks[category],
                        })}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {showTranslations && (
                <label>
                  {contentOnly ? 'Content (English)' : 'Label (English)'}
                  <input
                    value={draft.englishLabel}
                    onChange={(event) => setDraft({ ...draft, englishLabel: event.target.value })}
                    placeholder="English label (optional)"
                    disabled={saving}
                  />
                </label>
              )}
              {showTranslations && showDescription && (
                <label>
                  Brief description (English)
                  <textarea
                    rows={3}
                    value={draft.englishDescription}
                    onChange={(event) => setDraft({ ...draft, englishDescription: event.target.value })}
                    placeholder="English description (optional)"
                    disabled={saving}
                  />
                </label>
              )}
              {showStatus && <label>
                Status
                <select
                  value={draft.status}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value as CatalogStatus })}
                  disabled={saving}
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </label>}
              <footer>
                <button className="catalog-page__secondary-button" type="button" onClick={() => setDraft(null)} disabled={saving}>
                  Cancel
                </button>
                <button className="catalog-page__primary-button" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : draft.id === null ? 'Add item' : 'Save changes'}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {notification && (
        <div
          key={`${notification.type}-${notification.message}`}
          className={`catalog-notification catalog-notification--${notification.type}`}
          role={notification.type === 'error' ? 'alert' : 'status'}
          aria-live={notification.type === 'error' ? 'assertive' : 'polite'}
        >
          <span className="catalog-notification__icon" aria-hidden="true">
            {notification.type === 'success' ? '✓' : '!'}
          </span>
          {notification.message}
          <button type="button" aria-label="Dismiss notification" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
    </main>
  )
}

function getLocalizedText(item: CatalogItem, language: string, showTranslations: boolean) {
  if (!showTranslations) {
    return { label: item.label, description: item.description }
  }
  const locale = language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
  const translated = item.translations?.[locale]
  return {
    label: translated?.label.trim() || item.label,
    description: translated?.description || item.description,
  }
}
