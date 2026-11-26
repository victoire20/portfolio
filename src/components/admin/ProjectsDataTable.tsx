import { useState, type ReactNode } from 'react'

type ProjectType = 'CLI' | 'Web' | 'Mobile' | 'Desktop' | 'Cloud' | 'Framework'
type ProjectStatus = 'In progress' | 'Done'

type Project = {
  id: number
  name: string
  thumbnail?: string
  type: ProjectType
  target: string
  status: ProjectStatus
  started: string
  ended: string
}

const projectTypes: ProjectType[] = ['CLI', 'Web', 'Mobile', 'Desktop', 'Cloud', 'Framework']
const projectStatuses: ProjectStatus[] = ['In progress', 'Done']
const pageSizes = [5, 10, 20]

const initialProjects: Project[] = [
  { id: 1, name: 'Portfolio Website', thumbnail: '/images/projects/portfolio.jpg', type: 'Web', target: 'PC', status: 'Done', started: '2024-01-08', ended: '2024-03-22' },
  { id: 2, name: 'Task Runner', type: 'CLI', target: 'Dev tool', status: 'In progress', started: '2025-02-14', ended: '' },
  { id: 3, name: 'Pocket Budget', type: 'Mobile', target: 'Smartphone', status: 'Done', started: '2024-06-03', ended: '2024-09-10' },
  { id: 4, name: 'Cloud Deploy API', type: 'Cloud', target: 'Server', status: 'In progress', started: '2025-04-21', ended: '' },
  { id: 5, name: 'Component Toolkit', type: 'Framework', target: 'Dev tool', status: 'Done', started: '2023-11-06', ended: '2024-02-16' },
  { id: 6, name: 'Inventory Manager', type: 'Desktop', target: 'PC', status: 'In progress', started: '2025-05-12', ended: '' },
  { id: 7, name: 'Recipe Manager', type: 'Web', target: 'PC', status: 'Done', started: '2023-09-18', ended: '2023-12-05' },
  { id: 8, name: 'Terminal Dashboard', type: 'CLI', target: 'Dev tool', status: 'In progress', started: '2025-01-09', ended: '' },
  { id: 9, name: 'Shared Notes', type: 'Mobile', target: 'Smartphone', status: 'In progress', started: '2025-03-03', ended: '' },
  { id: 10, name: 'Asset Storage', type: 'Cloud', target: 'Server', status: 'Done', started: '2024-02-12', ended: '2024-07-26' },
  { id: 11, name: 'Design System', type: 'Framework', target: 'Dev tool', status: 'In progress', started: '2025-04-07', ended: '' },
  { id: 12, name: 'Desktop Music Player', type: 'Desktop', target: 'PC', status: 'Done', started: '2023-05-15', ended: '2023-10-30' },
  { id: 13, name: 'Weather Forecast', type: 'Web', target: 'Smartphone', status: 'Done', started: '2024-04-01', ended: '2024-05-24' },
  { id: 14, name: 'Log Monitor', type: 'CLI', target: 'Server', status: 'Done', started: '2024-08-05', ended: '2024-11-14' },
  { id: 15, name: 'Learning Tracker', type: 'Mobile', target: 'Smartphone', status: 'In progress', started: '2025-02-10', ended: '' },
  { id: 16, name: 'Backup Scheduler', type: 'Desktop', target: 'PC', status: 'In progress', started: '2025-05-19', ended: '' },
  { id: 17, name: 'Image CDN', type: 'Cloud', target: 'Server', status: 'In progress', started: '2025-06-02', ended: '' },
  { id: 18, name: 'Form Builder', type: 'Framework', target: 'Dev tool', status: 'Done', started: '2023-07-10', ended: '2023-12-18' },
  { id: 19, name: 'Event Planner', type: 'Web', target: 'PC', status: 'In progress', started: '2025-03-24', ended: '' },
  { id: 20, name: 'Device Sync', type: 'Mobile', target: 'Smartphone', status: 'Done', started: '2024-10-07', ended: '2025-01-16' },
]

function formatDate(value: string) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

type ProjectsDataTableProps = {
  showThumbnails?: boolean
  headerAction?: ReactNode
}

export default function ProjectsDataTable({ showThumbnails = false, headerAction }: ProjectsDataTableProps) {
  const [projects, setProjects] = useState(initialProjects)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Project | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(search.trim().toLowerCase())
    const matchesType = !typeFilter || project.type === typeFilter
    const matchesStatus = !statusFilter || project.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const firstProjectIndex = filteredProjects.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastProjectIndex = Math.min(currentPage * pageSize, filteredProjects.length)
  const visibleProjects = filteredProjects.slice(firstProjectIndex - (filteredProjects.length ? 1 : 0), currentPage * pageSize)

  function toggleStatus(project: Project) {
    const status: ProjectStatus = project.status === 'Done' ? 'In progress' : 'Done'
    setProjects((current) => current.map((item) => item.id === project.id
      ? { ...item, status, ended: status === 'Done' ? item.ended || new Date().toISOString().slice(0, 10) : '' }
      : item))
    setOpenMenuId(null)
  }

  function saveProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft) return
    setProjects((current) => current.map((project) => project.id === draft.id ? draft : project))
    setDraft(null)
  }

  return (
    <section className="projects-table" aria-labelledby="projects-table-title">
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
            {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
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
            {visibleProjects.map((project) => (
              <tr key={project.id}>
                <td className="projects-table__project-name">
                  {showThumbnails ? (
                    <span className="projects-table__project-cell">
                      {project.thumbnail ? (
                        <img
                          className="projects-table__thumbnail"
                          src={project.thumbnail}
                          alt={`${project.name} thumbnail`}
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
                      <span>{project.name}</span>
                    </span>
                  ) : project.name}
                </td>
                <td>{project.type}</td>
                <td>{project.target}</td>
                <td>
                  <span className={`projects-table__status projects-table__status--${project.status === 'Done' ? 'done' : 'progress'}`}>
                    <span aria-hidden="true" />
                    {project.status}
                  </span>
                </td>
                <td>{formatDate(project.started)}</td>
                <td>{formatDate(project.ended)}</td>
                <td className="projects-table__actions-cell">
                  <div className="projects-table__actions">
                    <button
                      type="button"
                      className="projects-table__more"
                      aria-label={`Actions for ${project.name}`}
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
                        <button type="button" role="menuitem" onClick={() => toggleStatus(project)}>
                          Mark as {project.status === 'Done' ? 'in progress' : 'done'}
                        </button>
                        <button type="button" role="menuitem" onClick={() => {
                          setDraft(project)
                          setOpenMenuId(null)
                        }}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="projects-table__menu-delete"
                          role="menuitem"
                          onClick={() => {
                            setProjects((current) => current.filter((item) => item.id !== project.id))
                            setOpenMenuId(null)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visibleProjects.length === 0 && (
              <tr>
                <td className="projects-table__empty" colSpan={7}>No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="projects-table__pagination">
        <p>
          {filteredProjects.length === 0
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

      {draft && (
        <div className="projects-table__overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDraft(null)
        }}>
          <section className="projects-table__dialog" role="dialog" aria-modal="true" aria-labelledby="edit-project-title">
            <header>
              <h2 id="edit-project-title">Edit project</h2>
              <p>Update the project details below.</p>
            </header>
            <form onSubmit={saveProject}>
              <label>
                Project name
                <input
                  required
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                />
              </label>
              <div className="projects-table__form-row">
                <label>
                  Type
                  <select
                    value={draft.type}
                    onChange={(event) => setDraft({ ...draft, type: event.target.value as ProjectType })}
                  >
                    {projectTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>
                <label>
                  Target
                  <input
                    required
                    value={draft.target}
                    onChange={(event) => setDraft({ ...draft, target: event.target.value })}
                  />
                </label>
              </div>
              <div className="projects-table__form-row">
                <label>
                  Status
                  <select
                    value={draft.status}
                    onChange={(event) => setDraft({ ...draft, status: event.target.value as ProjectStatus })}
                  >
                    {projectStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label>
                  Started
                  <input
                    required
                    type="date"
                    value={draft.started}
                    onChange={(event) => setDraft({ ...draft, started: event.target.value })}
                  />
                </label>
              </div>
              <label>
                Ended
                <input
                  type="date"
                  min={draft.started}
                  required={draft.status === 'Done'}
                  value={draft.ended}
                  onChange={(event) => setDraft({ ...draft, ended: event.target.value })}
                />
              </label>
              <footer>
                <button className="projects-table__button projects-table__button--outline" type="button" onClick={() => setDraft(null)}>
                  Cancel
                </button>
                <button className="projects-table__button projects-table__button--primary" type="submit">
                  Save changes
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  )
}
