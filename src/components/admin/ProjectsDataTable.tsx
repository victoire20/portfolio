import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAdminProjects from '../../hooks/useAdminProjects'
import useSupabaseCatalog from '../../hooks/useSupabaseCatalog'
import type { CatalogItem } from './ProjectCatalogPage'
import type { ProjectEditSource } from './ProjectForm'

type ProjectStatus = 'In progress' | 'Done'
const projectStatuses: ProjectStatus[] = ['In progress', 'Done']
const pageSizes = [5, 10, 20]

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
  const { i18n } = useTranslation()
  const { projects, loading, error } = useAdminProjects()
  const skills = useSupabaseCatalog('skills')
  const targets = useSupabaseCatalog('targets')
  const projectTypes = useSupabaseCatalog('project_types')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openMenuId, setOpenMenuId] = useState<CatalogItem['id'] | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const targetsById = new Map(targets.items.map((item) => [String(item.id), item]))
  const projectTypesById = new Map(projectTypes.items.map((item) => [String(item.id), item]))
  const projectTypeLabels = [...new Set(projects.flatMap((project) => (
    project.projectTypeIds
      .map((id) => projectTypesById.get(String(id)))
      .filter((item): item is CatalogItem => Boolean(item))
      .map((item) => getCatalogLabel(item, i18n.language))
  )))]
  const catalogErrors = [
    skills.error && `Skills: ${skills.error}`,
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

  function openEditForm(project: typeof projectsWithLabels[number]) {
    const source: ProjectEditSource = {
      id: project.id,
      name: project.title,
      ...(project.cover ? { thumbnail: project.cover } : {}),
      type: project.projectTypes[0] ?? '',
      target: project.targets[0] ?? '',
      status: project.status,
      started: project.startedAt ?? '',
      ended: project.endedAt ?? '',
    }
    setOpenMenuId(null)
    navigate(`/admin/projects/${project.id}/edit`, { state: source })
  }

  return (
    <section className="projects-table" aria-labelledby="projects-table-title" aria-busy={loading}>
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
              const statusLabel = project.translatedStatus[locale] ?? project.status
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
                  <td>{formatDate(project.startedAt)}</td>
                  <td>{formatDate(project.endedAt)}</td>
                  <td className="projects-table__actions-cell">
                    <div className="projects-table__actions">
                      <button
                        type="button"
                        className="projects-table__more"
                        aria-label={`Actions for ${project.title}`}
                        aria-haspopup="menu"
                        aria-expanded={openMenuId === project.id}
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
                          <button type="button" role="menuitem" onClick={() => openEditForm(project)}>
                            Edit
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
