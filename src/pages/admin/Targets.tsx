import ProjectCatalogPage, { type CatalogItem } from '../../components/admin/ProjectCatalogPage'

const targets: CatalogItem[] = [
  { id: 1, label: 'PC', description: 'Applications designed for desktop computers.', status: 'Enabled' },
  { id: 2, label: 'Smartphone', description: 'Applications intended for mobile phones.', status: 'Enabled' },
  { id: 3, label: 'Server', description: 'Services deployed and operated on servers.', status: 'Enabled' },
  { id: 4, label: 'Dev tool', description: 'Tools that support software development workflows.', status: 'Enabled' },
  { id: 5, label: 'Tablet', description: 'Applications optimized for tablet-sized screens.', status: 'Enabled' },
  { id: 6, label: 'Cross-platform', description: 'Software designed to work across multiple platforms.', status: 'Enabled' },
]

export default function Targets() {
  return (
    <ProjectCatalogPage
      title="Targets"
      description="Manage the target platforms available for your portfolio projects."
      initialItems={targets}
    />
  )
}
