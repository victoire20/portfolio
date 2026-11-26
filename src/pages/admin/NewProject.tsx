import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import '../../components/admin/Sidebar.css'
import './NewProject.css'

export default function NewProject() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
          <span>New project</span>
        </div>
        <div className="admin-new-project__page">
          <header>
            <h1 id="admin-new-project-title">Add new project</h1>
            <p>The project creation form will be added here later.</p>
          </header>
          <Link className="admin-new-project__back" to="/admin/projects">
            Back to projects
          </Link>
        </div>
      </section>
    </main>
  )
}
