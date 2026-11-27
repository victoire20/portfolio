import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import ProjectForm from '../../components/admin/ProjectForm'
import useAdminProjects from '../../hooks/useAdminProjects'
import type { AdminProject } from '../../types/adminProject'
import '../../components/admin/Sidebar.css'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isAdminProject(value: unknown, projectId: string | undefined): value is AdminProject {
  if (!value || typeof value !== 'object' || !projectId) return false
  if (!isRecord(value)) return false
  const project = value
  const maquette = isRecord(project.maquette) ? project.maquette : null
  const translations = isRecord(project.translations) ? project.translations : null
  const french = translations && isRecord(translations.fr) ? translations.fr : null
  const english = translations && isRecord(translations.en) ? translations.en : null
  const validOptionalString = (field: unknown) => field === null || typeof field === 'string'

  return (typeof project.id === 'number' || typeof project.id === 'string')
    && String(project.id) === projectId
    && typeof project.title === 'string'
    && typeof project.description === 'string'
    && validOptionalString(project.cover)
    && typeof project.isPrivate === 'boolean'
    && validOptionalString(project.liveUrl)
    && validOptionalString(project.githubUrl)
    && Boolean(maquette)
    && validOptionalString(maquette?.support)
    && validOptionalString(maquette?.url)
    && typeof project.isSmallProject === 'boolean'
    && validOptionalString(project.started_at)
    && validOptionalString(project.ended_at)
    && (project.status === 'Done' || project.status === 'In progress')
    && Boolean(french && typeof french.description === 'string' && typeof french.status === 'string')
    && Boolean(english && typeof english.description === 'string' && typeof english.status === 'string')
    && Array.isArray(project.skillIds)
    && Array.isArray(project.targetIds)
    && Array.isArray(project.projectTypeIds)
}

export default function NewProject() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { projectId } = useParams()
  const { state } = useLocation()
  const mode = projectId ? 'edit' : 'create'
  const projectFromNavigation = isAdminProject(state, projectId) ? state : undefined
  const shouldLoadProject = mode === 'edit' && !projectFromNavigation
  const { projects, loading, error } = useAdminProjects(
    shouldLoadProject ? projectId : null,
    shouldLoadProject,
  )
  const initialProject = projectFromNavigation
    ?? projects.find((project) => String(project.id) === projectId)

  return (
    <main className="admin-dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <section className="admin-dashboard__content" aria-labelledby="admin-new-project-title">
        <div className="admin-dashboard__topbar">
          <span>Admin</span>
          <span className="admin-dashboard__topbar-divider">/</span>
          <Link to="/admin/projects">Projects</Link>
          <span className="admin-dashboard__topbar-divider">/</span>
          <span>{mode === 'create' ? 'New project' : 'Edit project'}</span>
        </div>
        <ProjectForm
          key={projectId ?? 'new-project'}
          mode={mode}
          initialProject={initialProject}
          projectLoading={shouldLoadProject && loading}
          projectLoadError={shouldLoadProject ? error : null}
        />
      </section>
    </main>
  )
}
