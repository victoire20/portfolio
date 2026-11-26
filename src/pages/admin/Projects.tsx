import { useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import ProjectsDataTable from '../../components/admin/ProjectsDataTable'
import '../../components/admin/Sidebar.css'
import '../../components/admin/ProjectsDataTable.css'
import './Projects.css'

export default function AdminProjects() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <main className="admin-dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <section className="admin-dashboard__content" aria-labelledby="admin-projects-title">
        <div className="admin-dashboard__topbar">
          <span>Admin</span>
          <span className="admin-dashboard__topbar-divider">/</span>
          <span>Projects</span>
        </div>
        <div className="admin-projects__page">
          <h1 id="admin-projects-title" className="projects-table__visually-hidden">Projects</h1>
          <ProjectsDataTable showThumbnails />
        </div>
      </section>
    </main>
  )
}
