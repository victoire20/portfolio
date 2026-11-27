import ProjectCatalogPage from '../../components/admin/ProjectCatalogPage'
import useSupabaseCatalog from '../../hooks/useSupabaseCatalog'

export default function Targets() {
  const { items, loading, error, createItem, updateItem, setItemActive, deleteItem } =
    useSupabaseCatalog('targets')

  return (
    <ProjectCatalogPage
      key={loading ? 'targets-loading' : 'targets-loaded'}
      title="Targets"
      description="Manage the target platforms available for your portfolio projects."
      showStatusFilter
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
