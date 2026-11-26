import ProjectCatalogPage from '../../components/admin/ProjectCatalogPage'
import useSupabaseCatalog from '../../hooks/useSupabaseCatalog'

export default function ProjectTypes() {
  const { items, loading, error, createItem, updateItem, setItemActive, deleteItem } =
    useSupabaseCatalog('project_types')

  return (
    <ProjectCatalogPage
      key={loading ? 'project-types-loading' : 'project-types-loaded'}
      title="Project types"
      description="Manage the types available for your portfolio projects."
      initialItems={items}
      loading={loading}
      loadError={error}
      onCreate={createItem}
      onUpdate={updateItem}
      onSetActive={setItemActive}
      onDelete={deleteItem}
    />
  )
}
