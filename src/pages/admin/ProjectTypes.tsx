import ProjectCatalogPage, { type CatalogItem } from '../../components/admin/ProjectCatalogPage'

const projectTypes: CatalogItem[] = [
  { id: 1, label: 'CLI', description: 'Command-line interface applications.', status: 'Enabled' },
  { id: 2, label: 'Web', description: 'Browser-based websites and applications.', status: 'Enabled' },
  { id: 3, label: 'Mobile', description: 'Applications for smartphones and tablets.', status: 'Enabled' },
  { id: 4, label: 'Desktop', description: 'Software installed and run on desktop computers.', status: 'Enabled' },
  { id: 5, label: 'Cloud', description: 'Cloud-hosted services and infrastructure.', status: 'Enabled' },
  { id: 6, label: 'Framework', description: 'Reusable libraries and development frameworks.', status: 'Enabled' },
]

export default function ProjectTypes() {
  return (
    <ProjectCatalogPage
      title="Project types"
      description="Manage the types available for your portfolio projects."
      initialItems={projectTypes}
    />
  )
}
