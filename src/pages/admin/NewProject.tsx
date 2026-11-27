import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import ProjectForm, { type ProjectEditSource } from '../../components/admin/ProjectForm'
import '../../components/admin/Sidebar.css'
import { useLocation, useParams } from 'react-router-dom'

function isProjectEditSource(value: unknown, projectId: string | undefined): value is ProjectEditSource {
  if (!value || typeof value !== 'object' || !projectId) return false
  const project = value as Partial<ProjectEditSource>
  return (typeof project.id === 'number' || typeof project.id === 'string')
    && String(project.id) === projectId
    && typeof project.name === 'string'
    && typeof project.type === 'string'
    && typeof project.target === 'string'
    && (project.status === 'Done' || project.status === 'In progress')
    && typeof project.started === 'string'
    && typeof project.ended === 'string'
}

export default function NewProject() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { projectId } = useParams()
  const { state } = useLocation()
  const mode = projectId ? 'edit' : 'create'
  const initialProject = isProjectEditSource(state, projectId) ? state : undefined

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
        <ProjectForm key={projectId ?? 'new-project'} mode={mode} initialProject={initialProject} />
      </section>
    </main>
  )
}
