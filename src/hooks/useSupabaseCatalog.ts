import { useEffect, useState } from 'react'
import type { CatalogItem, CatalogStatus } from '../components/admin/ProjectCatalogPage'

type CatalogTable = 'targets' | 'project_types'

type CatalogCreateInput = Omit<CatalogItem, 'id'>
type CatalogUpdateInput = Omit<CatalogItem, 'id'>

type SupabaseCatalogRecord = {
  id: unknown
  libelle: unknown
  description: unknown
  is_active: unknown
}

function mapCatalogRecord(
  record: SupabaseCatalogRecord,
  fallbackStatus: CatalogStatus,
): CatalogItem {
  if (typeof record.id !== 'number' && typeof record.id !== 'string') {
    throw new Error('A catalog record has an invalid id.')
  }
  if (typeof record.libelle !== 'string' || !record.libelle.trim()) {
    throw new Error('A catalog record has an invalid libelle.')
  }
  if (record.description !== null && typeof record.description !== 'string') {
    throw new Error('A catalog record has an invalid description.')
  }

  return {
    id: record.id,
    label: record.libelle,
    description: record.description ?? '',
    status: typeof record.is_active === 'boolean'
      ? record.is_active ? 'Enabled' : 'Disabled'
      : fallbackStatus,
  }
}

export default function useSupabaseCatalog(
  table: CatalogTable,
  fallbackStatus: CatalogStatus = 'Enabled',
) {
  const [items, setItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadCatalog() {
      const { supabase } = await import('../utils/supabase')
      const { data, error: queryError } = await supabase
        .from(table)
        .select('id, libelle, description, is_active')

      if (!isCurrent) return

      if (queryError) {
        setError(queryError.message)
      } else {
        try {
          setItems((data ?? []).map((record: SupabaseCatalogRecord) => (
            mapCatalogRecord(record, fallbackStatus)
          )))
        } catch (mappingError) {
          setError(mappingError instanceof Error ? mappingError.message : 'Catalog data is invalid.')
        }
      }
      setLoading(false)
    }

    loadCatalog().catch((loadError: unknown) => {
      if (!isCurrent) return
      setError(loadError instanceof Error ? loadError.message : 'An unexpected error occurred.')
      setLoading(false)
    })

    return () => {
      isCurrent = false
    }
  }, [table, fallbackStatus])

  async function createItem(input: CatalogCreateInput) {
    const { supabase } = await import('../utils/supabase')
    const { data, error: insertError } = await supabase
      .from(table)
      .insert({
        libelle: input.label,
        description: input.description,
        is_active: input.status === 'Enabled',
      })
      .select('id, libelle, description, is_active')
      .single()

    if (insertError) throw new Error(insertError.message)
    if (!data) throw new Error('Supabase did not return the created catalog item.')

    return mapCatalogRecord(data, fallbackStatus)
  }

  async function updateItem(id: CatalogItem['id'], input: CatalogUpdateInput) {
    const { supabase } = await import('../utils/supabase')
    const { data, error: updateError } = await supabase
      .from(table)
      .update({
        libelle: input.label,
        description: input.description,
        is_active: input.status === 'Enabled',
      })
      .eq('id', id)
      .select('id, libelle, description, is_active')
      .single()

    if (updateError) throw new Error(updateError.message)
    if (!data) throw new Error('Supabase did not return the updated catalog item.')

    return mapCatalogRecord(data, fallbackStatus)
  }

  async function setItemActive(id: CatalogItem['id'], isActive: boolean) {
    const { supabase } = await import('../utils/supabase')
    const { data, error: updateError } = await supabase
      .from(table)
      .update({ is_active: isActive })
      .eq('id', id)
      .select('id, libelle, description, is_active')
      .single()

    if (updateError) throw new Error(updateError.message)
    if (!data) throw new Error('Supabase did not return the updated catalog item.')

    return mapCatalogRecord(data, fallbackStatus)
  }

  async function deleteItem(id: CatalogItem['id']) {
    const { supabase } = await import('../utils/supabase')
    const { data, error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle()

    if (deleteError) throw new Error(deleteError.message)
    if (!data) throw new Error('No matching catalog item was deleted.')
  }

  return { items, loading, error, createItem, updateItem, setItemActive, deleteItem }
}
