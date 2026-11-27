import { useEffect, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAdminProjects from '../../hooks/useAdminProjects'
import useSupabaseCatalog from '../../hooks/useSupabaseCatalog'
import {
  deleteProject as deleteProjectFromSupabase,
  getNextProjectStatus,
  updateProjectStatus,
} from '../../hooks/createProject'
import type { CatalogItem } from './ProjectCatalogPage'
import type { AdminProject, ProjectStatus } from '../../types/adminProject'

const projectStatuses: ProjectStatus[] = ['In progress', 'Done']
const pageSizes = [5, 10, 20]

type Notification = {
  type: 'success' | 'error'
  message: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getRouteNotification(value: unknown): Notification | null {
  if (!isRecord(value) || !isRecord(value.projectNotification)) return null
  const { type, message } = value.projectNotification
  if ((type !== 'success' && type !== 'error') || typeof message !== 'string') return null
  return { type, message }
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

function getCatalogLabel(item: CatalogItem, language: string) {
  const locale = language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
  return item.translations?.[locale].label.trim() || item.label
}

type ProjectsDataTableProps = {
  showThumbnails?: boolean
  headerAction?: ReactNode
}

export default function ProjectsDataTable({ showThumbnails = false, headerAction }: ProjectsDataTableProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { i18n } = useTranslation()
  const { projects, loading, error, replaceProject, removeProject: removeProjectFromState } = useAdminProjects()
  const targets = useSupabaseCatalog('targets')
  const projectTypes = useSupabaseCatalog('project_types')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openMenuId, setOpenMenuId] = useState<CatalogItem['id'] | null>(null)
  const [pendingProjectId, setPendingProjectId] = useState<CatalogItem['id'] | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const routeNotification = getRouteNotification(location.state)
  const routeNotificationMessage = routeNotification?.message
  const routeNotificationType = routeNotification?.type

  useEffect(() => {
    if (!notification) return
    const timer = window.setTimeout(() => setNotification(null), 4500)
    return () => window.clearTimeout(timer)
  }, [notification])

  useEffect(() => {
    if (routeNotificationMessage === undefined || routeNotificationType === undefined) return
    const timer = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null })
    }, 4500)
    return () => window.clearTimeout(timer)
  }, [location.pathname, navigate, routeNotificationMessage, routeNotificationType])

  const targetsById = new Map(targets.items.map((item) => [String(item.id), item]))
  const projectTypesById = new Map(projectTypes.items.map((item) => [String(item.id), item]))
  const projectTypeLabels = [...new Set(projects.flatMap((project) => (
    project.projectTypeIds
      .map((id) => projectTypesById.get(String(id)))
      .filter((item): item is CatalogItem => Boolean(item))
      .map((item) => getCatalogLabel(item, i18n.language))
  )))]
  const catalogErrors = [
    targets.error && `Targets: ${targets.error}`,
    projectTypes.error && `Project types: ${projectTypes.error}`,
  ].filter(Boolean)

  const projectsWithLabels = projects.map((project) => ({
    ...project,
    targets: project.targetIds
      .map((id) => targetsById.get(String(id)))
      .filter((item): item is CatalogItem => Boolean(item))
      .map((item) => getCatalogLabel(item, i18n.language)),
    projectTypes: project.projectTypeIds
      .map((id) => projectTypesById.get(String(id)))
      .filter((item): item is CatalogItem => Boolean(item))
      .map((item) => getCatalogLabel(item, i18n.language)),
  }))

  const filteredProjects = projectsWithLabels.filter((project) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = project.title.toLowerCase().includes(query)
      || project.targets.some((target) => target.toLowerCase().includes(query))
      || project.projectTypes.some((type) => type.toLowerCase().includes(query))
    const matchesType = !typeFilter || project.projectTypes.includes(typeFilter)
    const matchesStatus = !statusFilter || project.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const firstProjectIndex = filteredProjects.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastProjectIndex = Math.min(currentPage * pageSize, filteredProjects.length)
  const visibleProjects = filteredProjects.slice(
    firstProjectIndex - (filteredProjects.length ? 1 : 0),
    currentPage * pageSize,
  )
  const activeNotification = notification ?? routeNotification

  function openEditForm(project: AdminProject) {
    setOpenMenuId(null)
    navigate(`/admin/projects/${project.id}/edit`, { state: project })
  }

  async function toggleStatus(project: AdminProject) {
    const nextStatus = getNextProjectStatus(project.status)
    setPendingProjectId(project.id)
    setOpenMenuId(null)
    try {
      await updateProjectStatus(project, nextStatus)
      replaceProject({
        ...project,
        status: nextStatus,
        translations: {
          fr: { ...project.translations.fr, status: nextStatus === 'Done' ? 'Terminé' : 'En cours' },
          en: { ...project.translations.en, status: nextStatus },
        },
      })
      setNotification({ type: 'success', message: `Project marked as ${nextStatus.toLowerCase()}.` })
    } catch (actionError) {
      setNotification({
        type: 'error',
        message: actionError instanceof Error ? actionError.message : 'Could not update project status.',
      })
    } finally {
      setPendingProjectId(null)
    }
  }

  async function deleteProjectRow(project: AdminProject) {
    if (!window.confirm(`Delete "${project.title}"? This cannot be undone.`)) return
    setPendingProjectId(project.id)
    setOpenMenuId(null)
    try {
      await deleteProjectFromSupabase(project)
      removeProjectFromState(project.id)
      setNotification({ type: 'success', message: 'Project deleted successfully.' })
    } catch (actionError) {
      setNotification({
        type: 'error',
        message: actionError instanceof Error ? actionError.message : 'Could not delete the project.',
      })
    } finally {
      setPendingProjectId(null)
    }
  }

  return (
    <section className="projects-table" aria-labelledby="projects-table-title" aria-busy={loading || pendingProjectId !== null}>
      <header className="projects-table__heading">
        <div>
          <h2 id="projects-table-title">Projects</h2>
          <p>Manage your portfolio projects.</p>
        </div>
        <div className="projects-table__heading-actions">
          {headerAction}
          <span className="projects-table__count" aria-live="polite">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
          </span>
        </div>
      </header>

      {activeNotification && (
        <div
          className={`projects-table__notification projects-table__notification--${activeNotification.type}`}
          role={activeNotification.type === 'error' ? 'alert' : 'status'}
        >
          <span>{activeNotification.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => {
            if (routeNotification) navigate(location.pathname, { replace: true, state: null })
            setNotification(null)
          }}>×</button>
        </div>
      )}

      {(error || catalogErrors.length > 0) && (
        <div className="projects-table__load-error" role="alert">
          {error && <p>Could not load projects: {error}</p>}
          {catalogErrors.map((message) => <p key={message}>{message}</p>)}
        </div>
      )}

      <div className="projects-table__toolbar">
        <label className="projects-table__search">
          <span className="projects-table__visually-hidden">Search projects</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            type="search"
            placeholder="Filter projects..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
        </label>

        <label className="projects-table__filter">
          <span className="projects-table__visually-hidden">Filter by type</span>
          <select value={typeFilter} onChange={(event) => {
            setTypeFilter(event.target.value)
            setPage(1)
          }}>
            <option value="">All types</option>
            {projectTypeLabels.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>

        <label className="projects-table__filter">
          <span className="projects-table__visually-hidden">Filter by status</span>
          <select value={statusFilter} onChange={(event) => {
            setStatusFilter(event.target.value)
            setPage(1)
          }}>
            <option value="">All statuses</option>
            {projectStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>

      <div className="projects-table__scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">{showThumbnails ? 'Project' : 'Project name'}</th>
              <th scope="col">Type</th>
              <th scope="col">Target</th>
              <th scope="col">Status</th>
              <th scope="col">Started</th>
              <th scope="col">Ended</th>
              <th scope="col"><span className="projects-table__visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {visibleProjects.map((project) => {
              const locale = i18n.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
              const statusLabel = project.translations[locale].status || project.status
              return (
                <tr key={project.id}>
                  <td className="projects-table__project-name">
                    {showThumbnails ? (
                      <span className="projects-table__project-cell">
                        {project.cover ? (
                          <img
                            className="projects-table__thumbnail"
                            src={project.cover}
                            alt={`${project.title} thumbnail`}
                            loading="lazy"
                          />
                        ) : (
                          <span className="projects-table__thumbnail projects-table__thumbnail--placeholder" role="img" aria-label="No thumbnail available">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <rect x="3" y="4" width="18" height="16" rx="2" />
                              <circle cx="8.5" cy="9" r="1.5" />
                              <path d="m21 15-5-5L5 20" />
                            </svg>
                          </span>
                        )}
                        <span>{project.title}</span>
                      </span>
                    ) : project.title}
                  </td>
                  <td>{project.projectTypes.join(', ') || '—'}</td>
                  <td>{project.targets.join(', ') || '—'}</td>
                  <td>
                    <span className={`projects-table__status projects-table__status--${project.status === 'Done' ? 'done' : 'progress'}`}>
                      <span aria-hidden="true" />
                      {statusLabel}
                    </span>
                  </td>
                  <td>{formatDate(project.started_at)}</td>
                  <td>{formatDate(project.ended_at)}</td>
                  <td className="projects-table__actions-cell">
                    <div className="projects-table__actions">
                      <button
                        type="button"
                        className="projects-table__more"
                        aria-label={`Actions for ${project.title}`}
                        aria-haspopup="menu"
                        aria-expanded={openMenuId === project.id}
                        disabled={pendingProjectId !== null}
                        onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <circle cx="5" cy="12" r="1" />
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                        </svg>
                      </button>
                      {openMenuId === project.id && (
                        <div className="projects-table__menu" role="menu">
                          <button type="button" role="menuitem" disabled={pendingProjectId !== null} onClick={() => toggleStatus(project)}>
                            Mark as {project.status === 'Done' ? 'in progress' : 'done'}
                          </button>
                          <button type="button" role="menuitem" disabled={pendingProjectId !== null} onClick={() => openEditForm(project)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="projects-table__menu-delete"
                            role="menuitem"
                            disabled={pendingProjectId !== null}
                            onClick={() => deleteProjectRow(project)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {visibleProjects.length === 0 && (
              <tr>
                <td className="projects-table__empty" colSpan={7}>
                  {loading
                    ? 'Loading projects…'
                    : error
                      ? 'Projects could not be loaded.'
                      : projects.length === 0
                        ? 'No projects yet.'
                        : 'No projects found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="projects-table__pagination">
        <p>
          {loading
            ? 'Loading projects…'
            : filteredProjects.length === 0
              ? 'No projects to display'
              : `Showing ${firstProjectIndex}–${lastProjectIndex} of ${filteredProjects.length} projects`}
        </p>
        <div className="projects-table__pagination-controls">
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
    </section>
  )
}
