import type { ReactNode } from 'react'

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

type IconName = 'grid' | 'folder' | 'chart' | 'settings' | 'chevron' | 'briefcase'

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    folder: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M3 10h18" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-5 5" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.7 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.7-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.7-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.7 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2Z" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      className="admin-sidebar__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

const navigation = [
  { label: 'Overview', icon: 'grid' as const, active: true },
  { label: 'Projects', icon: 'folder' as const },
  { label: 'Analytics', icon: 'chart' as const },
  { label: 'Settings', icon: 'settings' as const },
]

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`admin-sidebar${collapsed ? ' admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__brand">
        <span className="admin-sidebar__brand-mark">
          <Icon name="briefcase" />
        </span>
        {!collapsed && <span className="admin-sidebar__brand-name">Portfolio Admin</span>}
      </div>

      <div className="admin-sidebar__section-label">
        {!collapsed && <span>Workspace</span>}
      </div>
      <nav className="admin-sidebar__nav" aria-label="Admin navigation">
        {navigation.map((item) => (
          <button
            key={item.label}
            className={`admin-sidebar__nav-item${item.active ? ' is-active' : ''}`}
            type="button"
            title={collapsed ? item.label : undefined}
            aria-current={item.active ? 'page' : undefined}
          >
            <Icon name={item.icon} />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar__bottom">
        <button
          className="admin-sidebar__collapse"
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icon name="chevron" />
          {!collapsed && <span>Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  )
}
