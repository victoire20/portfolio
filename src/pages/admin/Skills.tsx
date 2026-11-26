import ProjectCatalogPage from '../../components/admin/ProjectCatalogPage'
import useSupabaseCatalog from '../../hooks/useSupabaseCatalog'
import { skillCategories } from '../../types/skill'

export default function Skills() {
  const { items, loading, error, createItem, createItems, updateItem, setItemActive, deleteItem } =
    useSupabaseCatalog('skills')

  return (
    <ProjectCatalogPage
      key={loading ? 'skills-loading' : 'skills-loaded'}
      title="Skills"
      description="Manage the skills available for your portfolio."
      initialItems={items}
      showDescription={false}
      showTranslations={false}
      allowBulkCreate
      onCreateMany={createItems}
      categories={skillCategories}
      loading={loading}
      loadError={error}
      onCreate={createItem}
      onUpdate={updateItem}
      onSetActive={setItemActive}
      onDelete={deleteItem}
    />
  )
}
