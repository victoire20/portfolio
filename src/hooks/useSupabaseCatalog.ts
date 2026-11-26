import { useEffect, useState } from 'react'
import type {
  CatalogItem,
  CatalogStatus,
  CatalogTranslations,
} from '../components/admin/ProjectCatalogPage'
import { skillCategories, type SkillCategory } from '../types/skill'

type CatalogTable = 'targets' | 'project_types' | 'skills' | 'funfacts'

type CatalogCreateInput = Omit<CatalogItem, 'id'>
type CatalogUpdateInput = Omit<CatalogItem, 'id'>

type SupabaseCatalogRecord = {
  id: unknown
  libelle?: unknown
  content?: unknown
  description?: unknown
  is_active?: unknown
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
  const contentOnly = table === 'funfacts'
  const label = readString(contentOnly ? record.content : record.libelle)
  if (!label || !label.trim()) {
    throw new Error(contentOnly
      ? 'A fun fact has invalid content.'
      : 'A catalog record has an invalid libelle.')
  }
  if (!contentOnly && (
    record.description !== undefined
    && record.description !== null
    && typeof record.description !== 'string'
  )) {
    throw new Error('A catalog record has an invalid description.')
  }

  const baseDescription = typeof record.description === 'string' ? record.description : ''
  let translations: CatalogTranslations | undefined
  if (table !== 'skills') {
    const rawTranslations = isRecord(record.translations) ? record.translations : {}
    const french = isRecord(rawTranslations.fr) ? rawTranslations.fr : {}
    const english = isRecord(rawTranslations.en) ? rawTranslations.en : {}
    translations = {
      fr: {
        label: contentOnly
          ? readString(french.content) || label
          : readString(french.label) || label,
        description: contentOnly ? '' : readString(french.description) ?? baseDescription,
      },
      en: {
        label: contentOnly
          ? readString(english.content) ?? ''
          : readString(english.label) ?? '',
        description: contentOnly ? '' : readString(english.description) ?? '',
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
    label,
    description: baseDescription,
    ...(typeof record.is_active === 'boolean'
      ? { status: record.is_active ? 'Enabled' as const : 'Disabled' as const }
      : table !== 'funfacts'
        ? { status: fallbackStatus }
        : {}),
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
        : table === 'funfacts'
          ? await supabase
            .from('funfacts')
            .select('id, content, translations')
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
      : table === 'funfacts'
        ? await supabase
          .from('funfacts')
          .insert({
            content: input.label,
            translations: {
              fr: { content: input.label },
              en: { content: input.translations?.en.label ?? '' },
            },
          })
          .select('id, content, translations')
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
      : table === 'funfacts'
        ? await supabase
          .from('funfacts')
          .update({
            content: input.label,
            translations: {
              fr: { content: input.label },
              en: { content: input.translations?.en.label ?? '' },
            },
          })
          .eq('id', id)
          .select('id, content, translations')
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
    if (table === 'funfacts') {
      throw new Error('Fun facts do not have an active status.')
    }
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

  async function createItems(inputs: CatalogCreateInput[]) {
    if (table !== 'skills') {
      throw new Error('Bulk creation is only available for skills.')
    }

    const { supabase } = await import('../utils/supabase')
    const { data, error: insertError } = await supabase
      .from('skills')
      .insert(inputs.map((input) => ({
        libelle: input.label,
        type: input.type,
        is_active: input.status === 'Enabled',
      })))
      .select('id, libelle, type, is_active')
      .overrideTypes<SupabaseCatalogRecord[]>()

    if (insertError) throw new Error(insertError.message)
    if (!data || data.length !== inputs.length) {
      throw new Error('Supabase did not return all created skills.')
    }
    return data.map((record) => mapCatalogRecord(record, fallbackStatus, table))
  }

  return { items, loading, error, createItem, createItems, updateItem, setItemActive, deleteItem }
}
