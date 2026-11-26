import { useState } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import ProjectsDataTable from '../../components/admin/ProjectsDataTable'
import '../../components/admin/Sidebar.css'
import '../../components/admin/ProjectsDataTable.css'
import './Index.css'

export default function AdminIndex() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <main className="admin-dashboard">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <section className="admin-dashboard__content" aria-labelledby="admin-dashboard-title">
        <div className="admin-dashboard__topbar">
          <span>Admin</span>
          <span className="admin-dashboard__topbar-divider">/</span>
          <span>Overview</span>
        </div>
        <div className="admin-dashboard__page">
          <header className="admin-dashboard__header">
            <div>
              <p className="admin-dashboard__eyebrow">Workspace</p>
              <h1 id="admin-dashboard-title">Overview</h1>
              <p className="admin-dashboard__description">
                Welcome to your portfolio dashboard.
              </p>
            </div>
          </header>
          <div className="admin-dashboard__welcome">
            <h2>Admin dashboard</h2>
            <p>Your portfolio workspace is ready.</p>
          </div>
          <ProjectsDataTable />
        </div>
      </section>
    </main>
  )
}
