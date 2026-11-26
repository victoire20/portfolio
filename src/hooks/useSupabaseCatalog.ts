import { useEffect, useState } from 'react'
import type {
  CatalogItem,
  CatalogStatus,
  CatalogTranslations,
} from '../components/admin/ProjectCatalogPage'
import { skillCategories, type SkillCategory } from '../types/skill'

type CatalogTable = 'targets' | 'project_types' | 'skills'

type CatalogCreateInput = Omit<CatalogItem, 'id'>
type CatalogUpdateInput = Omit<CatalogItem, 'id'>

type SupabaseCatalogRecord = {
  id: unknown
  libelle: unknown
  description?: unknown
  is_active: unknown
  type?: unknown
  translations?: unknown
}

function mapCatalogRecord(
  record: SupabaseCatalogRecord,
  fallbackStatus: CatalogStatus,
  table: CatalogTable,
): CatalogItem {
  if (typeof record.id !== 'number' && typeof record.id !== 'string') {
    throw new Error('A catalog record has an invalid id.')
  }
  if (typeof record.libelle !== 'string' || !record.libelle.trim()) {
    throw new Error('A catalog record has an invalid libelle.')
  }
  if (
    record.description !== undefined
    && record.description !== null
    && typeof record.description !== 'string'
  ) {
    throw new Error('A catalog record has an invalid description.')
  }

  const baseDescription = record.description ?? ''
  let translations: CatalogTranslations | undefined
  if (table !== 'skills') {
    const rawTranslations = isRecord(record.translations) ? record.translations : {}
    const french = isRecord(rawTranslations.fr) ? rawTranslations.fr : {}
    const english = isRecord(rawTranslations.en) ? rawTranslations.en : {}
    translations = {
      fr: {
        label: readString(french.label) || record.libelle,
        description: readString(french.description) ?? baseDescription,
      },
      en: {
        label: readString(english.label) ?? '',
        description: readString(english.description) ?? '',
      },
    }
  }

  let type: SkillCategory | undefined
  if (table === 'skills') {
    if (typeof record.type !== 'string' || !skillCategories.includes(record.type as SkillCategory)) {
      throw new Error('A skill record has an invalid type.')
    }
    type = record.type as SkillCategory
  }

  return {
    id: record.id,
    label: record.libelle,
    description: baseDescription,
    status: typeof record.is_active === 'boolean'
      ? record.is_active ? 'Enabled' : 'Disabled'
      : fallbackStatus,
    ...(translations ? { translations } : {}),
    ...(type ? { type } : {}),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : null
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
      const response = table === 'skills'
        ? await supabase
          .from('skills')
          .select('id, libelle, type, is_active')
          .overrideTypes<SupabaseCatalogRecord[]>()
        : await supabase
          .from(table)
          .select('id, libelle, description, is_active, translations')
          .overrideTypes<SupabaseCatalogRecord[]>()
      const { data, error: queryError } = response

      if (!isCurrent) return

      if (queryError) {
        setError(queryError.message)
      } else {
        try {
          setItems((data ?? []).map((record: SupabaseCatalogRecord) => (
            mapCatalogRecord(record, fallbackStatus, table)
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
    const response = table === 'skills'
      ? await supabase
        .from('skills')
        .insert({
          libelle: input.label,
          type: input.type,
          is_active: input.status === 'Enabled',
        })
        .select('id, libelle, type, is_active')
        .overrideTypes<SupabaseCatalogRecord[]>()
      : await supabase
        .from(table)
        .insert({
          libelle: input.label,
          description: input.description,
          is_active: input.status === 'Enabled',
          translations: input.translations,
        })
        .select('id, libelle, description, is_active, translations')
        .overrideTypes<SupabaseCatalogRecord[]>()
    const { data, error: insertError } = response

    if (insertError) throw new Error(insertError.message)
    if (!data?.[0]) throw new Error('Supabase did not return the created catalog item.')

    return mapCatalogRecord(data[0], fallbackStatus, table)
  }

  async function updateItem(id: CatalogItem['id'], input: CatalogUpdateInput) {
    const { supabase } = await import('../utils/supabase')
    const response = table === 'skills'
      ? await supabase
        .from('skills')
        .update({
          libelle: input.label,
          type: input.type,
          is_active: input.status === 'Enabled',
        })
        .eq('id', id)
        .select('id, libelle, type, is_active')
        .overrideTypes<SupabaseCatalogRecord[]>()
      : await supabase
        .from(table)
        .update({
          libelle: input.label,
          description: input.description,
          is_active: input.status === 'Enabled',
          translations: input.translations,
        })
        .eq('id', id)
        .select('id, libelle, description, is_active, translations')
        .overrideTypes<SupabaseCatalogRecord[]>()
    const { data, error: updateError } = response

    if (updateError) throw new Error(updateError.message)
    if (!data?.[0]) throw new Error('Supabase did not return the updated catalog item.')

    return mapCatalogRecord(data[0], fallbackStatus, table)
  }

  async function setItemActive(id: CatalogItem['id'], isActive: boolean) {
    const { supabase } = await import('../utils/supabase')
    const response = table === 'skills'
      ? await supabase
        .from('skills')
        .update({ is_active: isActive })
        .eq('id', id)
        .select('id, libelle, type, is_active')
        .overrideTypes<SupabaseCatalogRecord[]>()
      : await supabase
        .from(table)
        .update({ is_active: isActive })
        .eq('id', id)
        .select('id, libelle, description, is_active, translations')
        .overrideTypes<SupabaseCatalogRecord[]>()
    const { data, error: updateError } = response

    if (updateError) throw new Error(updateError.message)
    if (!data?.[0]) throw new Error('Supabase did not return the updated catalog item.')

    return mapCatalogRecord(data[0], fallbackStatus, table)
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
