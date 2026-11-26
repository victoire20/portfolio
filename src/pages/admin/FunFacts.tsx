import ProjectCatalogPage from '../../components/admin/ProjectCatalogPage'
import useSupabaseCatalog from '../../hooks/useSupabaseCatalog'

export default function FunFacts() {
  const { items, loading, error, createItem, updateItem, setItemActive, deleteItem } =
    useSupabaseCatalog('fun_facts')

  return (
    <ProjectCatalogPage
      key={loading ? 'fun-facts-loading' : 'fun-facts-loaded'}
      title="Fun facts"
      description="Manage the fun facts shown in your portfolio."
      initialItems={items}
      showDescription={false}
      contentOnly
      showStatus={false}
      showStatusFilter={false}
      showTypeFilter={false}
      loading={loading}
      loadError={error}
      onCreate={createItem}
      onUpdate={updateItem}
      onSetActive={setItemActive}
      onDelete={deleteItem}
    />
  )
}
