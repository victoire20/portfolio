import { useEffect, useState, type FormEvent } from 'react'
import Sidebar from './Sidebar'
import './Sidebar.css'
import './ProjectCatalogPage.css'

export type CatalogStatus = 'Enabled' | 'Disabled'

export type CatalogItem = {
  id: number
  label: string
  description: string
  status: CatalogStatus
}

type CatalogDraft = {
  id: number | null
  label: string
  description: string
  status: CatalogStatus
}

type ProjectCatalogPageProps = {
  title: string
  description: string
  initialItems: CatalogItem[]
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
}: ProjectCatalogPageProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [items, setItems] = useState<CatalogItem[]>(() => [...initialItems])
  const [draft, setDraft] = useState<CatalogDraft | null>(null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filteredItems = items.filter((item) => {
    const query = search.trim().toLowerCase()
    return item.label.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })
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
    setDraft({ id: null, label: '', description: '', status: 'Enabled' })
  }

  function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft) return

    const label = draft.label.trim()
    const itemDescription = draft.description.trim()

    if (!label) {
      notify('error', 'A label is required.')
      return
    }

    const duplicate = items.some((item) =>
      item.id !== draft.id && item.label.toLowerCase() === label.toLowerCase(),
    )
    if (duplicate) {
      notify('error', 'An item with this label already exists.')
      return
    }

    if (draft.id === null) {
      const newItem: CatalogItem = {
        ...draft,
        id: Math.max(0, ...items.map((item) => item.id)) + 1,
        label,
        description: itemDescription,
      }
      setItems((current) => [...current, newItem])
      setPage(1)
      notify('success', 'Item added successfully.')
    } else {
      setItems((current) => current.map((item) => item.id === draft.id
        ? { ...draft, label, description: itemDescription, id: draft.id! }
        : item))
      notify('success', 'Item updated successfully.')
    }

    setDraft(null)
  }

  function toggleStatus(item: CatalogItem) {
    const status: CatalogStatus = item.status === 'Enabled' ? 'Disabled' : 'Enabled'
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status } : entry))
    setOpenMenuId(null)
    notify('success', `Status changed to ${status.toLowerCase()}.`)
  }

  function deleteItem(item: CatalogItem) {
    setItems((current) => current.filter((entry) => entry.id !== item.id))
    setOpenMenuId(null)
    notify('success', 'Item deleted successfully.')
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
              <span className="catalog-table__count" aria-live="polite">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="catalog-table__scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Label</th>
                    <th scope="col">Description</th>
                    <th scope="col">Status</th>
                    <th scope="col"><span className="catalog-page__visually-hidden">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item) => (
                    <tr key={item.id}>
                      <td className="catalog-table__label">{item.label}</td>
                      <td className="catalog-table__description">{item.description}</td>
                      <td>
                        <span className={`catalog-table__status catalog-table__status--${item.status.toLowerCase()}`}>
                          <span aria-hidden="true" />
                          {item.status}
                        </span>
                      </td>
                      <td className="catalog-table__actions-cell">
                        <div className="catalog-table__actions">
                          <button
                            type="button"
                            className="catalog-table__more"
                            aria-label={`Actions for ${item.label}`}
                            aria-haspopup="menu"
                            aria-expanded={openMenuId === item.id}
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
                              <button type="button" role="menuitem" onClick={() => {
                                setDraft(item)
                                setOpenMenuId(null)
                              }}>
                                Edit
                              </button>
                              <button type="button" role="menuitem" onClick={() => toggleStatus(item)}>
                                {item.status === 'Enabled' ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                type="button"
                                className="catalog-table__menu-delete"
                                role="menuitem"
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
                      <td className="catalog-table__empty" colSpan={4}>
                        {items.length === 0 ? 'No items yet. Add one to get started.' : 'No items found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="catalog-table__footer">
              <p>
                {filteredItems.length === 0
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
            if (event.target === event.currentTarget) setDraft(null)
          }}
        >
          <section className="catalog-modal" role="dialog" aria-modal="true" aria-labelledby="catalog-modal-title">
            <header>
              <div>
                <h2 id="catalog-modal-title">{draft.id === null ? `Add ${title.toLowerCase().replace(/s$/, '')}` : `Edit ${title.toLowerCase().replace(/s$/, '')}`}</h2>
                <p>Enter a label, a short description, and its status.</p>
              </div>
              <button type="button" className="catalog-modal__close" aria-label="Close" onClick={() => setDraft(null)}>
                ×
              </button>
            </header>
            <form onSubmit={saveItem}>
              <label>
                Label
                <input
                  autoFocus
                  value={draft.label}
                  onChange={(event) => setDraft({ ...draft, label: event.target.value })}
                  placeholder="Enter a label"
                />
              </label>
              <label>
                Brief description
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(event) => setDraft({ ...draft, description: event.target.value })}
                  placeholder="Describe this item briefly"
                />
              </label>
              <label>
                Status
                <select
                  value={draft.status}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value as CatalogStatus })}
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </label>
              <footer>
                <button className="catalog-page__secondary-button" type="button" onClick={() => setDraft(null)}>
                  Cancel
                </button>
                <button className="catalog-page__primary-button" type="submit">
                  {draft.id === null ? 'Add item' : 'Save changes'}
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
