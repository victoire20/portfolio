import type { CatalogItem } from '../components/admin/ProjectCatalogPage'

export type CreateProjectInput = {
  title: string
  descriptionFr: string
  descriptionEn: string
  cover: string
  isPrivate: boolean
  liveUrl: string
  githubUrl: string
  maquetteSupport: string
  maquetteUrl: string
  isSmallProject: boolean
  startedAt: string
  endedAt: string
  status: 'In progress' | 'Done'
  skillIds: CatalogItem['id'][]
  targetIds: CatalogItem['id'][]
  projectTypeIds: CatalogItem['id'][]
}

type CreatedProject = {
  id: unknown
}

type RelationGroup = {
  table: 'project_skills' | 'project_targets' | 'project_project_types'
  foreignKey: 'project_id' | 'projet_id'
  rows: Record<string, CatalogItem['id']>[]
}

export default async function createProject(input: CreateProjectInput) {
  const { supabase } = await import('../utils/supabase')
  const { data, error: insertError } = await supabase
    .from('projects')
    .insert({
      title: input.title.trim(),
      description: input.descriptionEn.trim(),
      cover: input.cover.trim() || null,
      isPrivate: input.isPrivate,
      liveUrl: input.liveUrl.trim() || null,
      githubUrl: input.githubUrl.trim() || null,
      maquette: {
        support: input.maquetteSupport.trim() || null,
        url: input.maquetteUrl.trim() || null,
      },
      isSmallProject: input.isSmallProject,
      started_at: input.startedAt || null,
      ended__at: input.endedAt || null,
      status: input.status,
      translations: {
        fr: {
          description: input.descriptionFr.trim(),
          status: input.status === 'Done' ? 'Terminé' : 'En cours',
        },
        en: {
          description: input.descriptionEn.trim(),
          status: input.status,
        },
      },
    })
    .select('id')
    .single()
    .overrideTypes<CreatedProject>()

  if (insertError) throw new Error(insertError.message)
  if (!data || (typeof data.id !== 'number' && typeof data.id !== 'string')) {
    throw new Error('Supabase did not return the created project id.')
  }

  const projectId = data.id
  const relationGroups: RelationGroup[] = [
    {
      table: 'project_skills',
      foreignKey: 'project_id',
      rows: input.skillIds.map((skillId) => ({ project_id: projectId, skill_id: skillId })),
    },
    {
      table: 'project_targets',
      foreignKey: 'projet_id',
      rows: input.targetIds.map((targetId) => ({ projet_id: projectId, target_id: targetId })),
    },
    {
      table: 'project_project_types',
      foreignKey: 'project_id',
      rows: input.projectTypeIds.map((projectTypeId) => ({
        project_id: projectId,
        project_type_id: projectTypeId,
      })),
    },
  ]

  for (const group of relationGroups) {
    if (group.rows.length === 0) continue

    try {
      const { error: relationError } = await insertRelation(group)
      if (relationError) throw new Error(relationError.message)
    } catch (relationError) {
      const cleanupErrors = await rollbackProject(projectId, relationGroups)
      const cleanupMessage = cleanupErrors.length > 0
        ? ` Rollback was incomplete: ${cleanupErrors.join('; ')}.`
        : ''
      const message = relationError instanceof Error
        ? relationError.message
        : 'An unexpected database error occurred.'
      throw new Error(`Could not create project relations: ${message}.${cleanupMessage}`)
    }
  }
}

async function insertRelation(group: RelationGroup) {
  const { supabase } = await import('../utils/supabase')
  switch (group.table) {
    case 'project_skills':
      return supabase.from('project_skills').insert(group.rows)
    case 'project_targets':
      return supabase.from('project_targets').insert(group.rows)
    case 'project_project_types':
      return supabase.from('project_project_types').insert(group.rows)
  }
}

async function deleteRelation(group: RelationGroup, projectId: CatalogItem['id']) {
  const { supabase } = await import('../utils/supabase')
  switch (group.table) {
    case 'project_skills':
      return supabase.from('project_skills').delete().eq('project_id', projectId)
    case 'project_targets':
      return supabase.from('project_targets').delete().eq('projet_id', projectId)
    case 'project_project_types':
      return supabase.from('project_project_types').delete().eq('project_id', projectId)
  }
}

async function rollbackProject(projectId: CatalogItem['id'], relationGroups: RelationGroup[]) {
  const { supabase } = await import('../utils/supabase')
  const errors: string[] = []

  for (const group of [...relationGroups].reverse()) {
    try {
      const { error } = await deleteRelation(group, projectId)
      if (error) errors.push(`${group.table}: ${error.message}`)
    } catch (error) {
      errors.push(`${group.table}: ${error instanceof Error ? error.message : 'cleanup failed'}`)
    }
  }

  try {
    const { error } = await supabase.from('projects').delete().eq('id', projectId)
    if (error) errors.push(`projects: ${error.message}`)
  } catch (error) {
    errors.push(`projects: ${error instanceof Error ? error.message : 'cleanup failed'}`)
  }
  return errors
}
