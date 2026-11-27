import type { CatalogItem } from '../components/admin/ProjectCatalogPage'
import type { AdminProject, ProjectStatus } from '../types/adminProject'

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

export function projectToInput(project: AdminProject, status = project.status): CreateProjectInput {
  return {
    title: project.title,
    descriptionFr: project.translations.fr.description,
    descriptionEn: project.translations.en.description,
    cover: project.cover ?? '',
    isPrivate: project.isPrivate,
    liveUrl: project.liveUrl ?? '',
    githubUrl: project.githubUrl ?? '',
    maquetteSupport: project.maquette.support ?? '',
    maquetteUrl: project.maquette.url ?? '',
    isSmallProject: project.isSmallProject,
    startedAt: project.started_at ?? '',
    endedAt: project.ended_at ?? '',
    status,
    skillIds: project.skillIds,
    targetIds: project.targetIds,
    projectTypeIds: project.projectTypeIds,
  }
}

type CreatedProject = {
  id: unknown
}

type RelationGroup = {
  table: 'project_skills' | 'project_targets' | 'project_project_types'
  rows: Record<string, CatalogItem['id']>[]
}

function projectPayload(input: CreateProjectInput) {
  return {
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
    ended_at: input.endedAt || null,
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
  }
}

export default async function createProject(input: CreateProjectInput) {
  const { supabase } = await import('../utils/supabase')
  const { data, error: insertError } = await supabase
    .from('projects')
    .insert(projectPayload(input))
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
      rows: input.skillIds.map((skillId) => ({ project_id: projectId, skill_id: skillId })),
    },
    {
      table: 'project_targets',
      rows: input.targetIds.map((targetId) => ({ project_id: projectId, target_id: targetId })),
    },
    {
      table: 'project_project_types',
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

export async function updateProject(
  project: AdminProject,
  input: CreateProjectInput,
) {
  const { supabase } = await import('../utils/supabase')
  const { data, error } = await supabase
    .from('projects')
    .update(projectPayload(input))
    .eq('id', project.id)
    .select('id')
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('No matching project was updated.')

  try {
    await replaceProjectRelations(project.id, input)
  } catch (relationError) {
    const cleanupErrors: string[] = []
    try {
      const { error: projectRollbackError } = await supabase
        .from('projects')
        .update(projectPayload(projectToInput(project)))
        .eq('id', project.id)
      if (projectRollbackError) cleanupErrors.push(`project: ${projectRollbackError.message}`)
    } catch (rollbackError) {
      cleanupErrors.push(`project: ${getErrorMessage(rollbackError)}`)
    }

    try {
      await replaceProjectRelations(project.id, projectToInput(project))
    } catch (rollbackError) {
      cleanupErrors.push(`relations: ${getErrorMessage(rollbackError)}`)
    }

    const cleanupMessage = cleanupErrors.length
      ? ` Rollback was incomplete: ${cleanupErrors.join('; ')}.`
      : ''
    throw new Error(`Could not update project relations: ${getErrorMessage(relationError)}.${cleanupMessage}`)
  }
}

export async function updateProjectStatus(project: AdminProject, status: ProjectStatus) {
  const { supabase } = await import('../utils/supabase')
  const { data, error } = await supabase
    .from('projects')
    .update({
      status,
      translations: {
        fr: {
          description: project.translations.fr.description,
          status: status === 'Done' ? 'Terminé' : 'En cours',
        },
        en: {
          description: project.translations.en.description,
          status,
        },
      },
    })
    .eq('id', project.id)
    .select('id')
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error('No matching project status was updated.')
}

export async function deleteProject(project: AdminProject) {
  const { supabase } = await import('../utils/supabase')
  const input = projectToInput(project)

  try {
    await clearProjectRelations(project.id)
  } catch (relationError) {
    const cleanupMessage = await restoreRelationsAfterDelete(project.id, input)
    throw new Error(`Could not remove project relations: ${getErrorMessage(relationError)}.${cleanupMessage}`)
  }

  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', project.id)
    .select('id')
    .maybeSingle()

  if (error || !data) {
    const cleanupMessage = await restoreRelationsAfterDelete(project.id, input)
    throw new Error(`${error?.message ?? 'No matching project was deleted.'}${cleanupMessage}`)
  }
}

export function getNextProjectStatus(status: ProjectStatus): ProjectStatus {
  return status === 'Done' ? 'In progress' : 'Done'
}

async function replaceProjectRelations(projectId: CatalogItem['id'], input: CreateProjectInput) {
  await clearProjectRelations(projectId)
  const groups = getRelationGroups(projectId, input)
  for (const group of groups) {
    if (group.rows.length === 0) continue
    const { error } = await insertRelation(group)
    if (error) throw new Error(error.message)
  }
}

async function clearProjectRelations(projectId: CatalogItem['id']) {
  const { supabase } = await import('../utils/supabase')
  const responses = await Promise.all([
    supabase.from('project_skills').delete().eq('project_id', projectId),
    supabase.from('project_targets').delete().eq('project_id', projectId),
    supabase.from('project_project_types').delete().eq('project_id', projectId),
  ])
  const error = responses.find((response) => response.error)?.error
  if (error) throw new Error(error.message)
}

async function restoreRelationsAfterDelete(projectId: CatalogItem['id'], input: CreateProjectInput) {
  try {
    await replaceProjectRelations(projectId, input)
    return ''
  } catch (error) {
    return ` Rollback was incomplete: ${getErrorMessage(error)}.`
  }
}

function getRelationGroups(projectId: CatalogItem['id'], input: CreateProjectInput): RelationGroup[] {
  return [
    {
      table: 'project_skills',
      rows: input.skillIds.map((skillId) => ({ project_id: projectId, skill_id: skillId })),
    },
    {
      table: 'project_targets',
      rows: input.targetIds.map((targetId) => ({ project_id: projectId, target_id: targetId })),
    },
    {
      table: 'project_project_types',
      rows: input.projectTypeIds.map((projectTypeId) => ({
        project_id: projectId,
        project_type_id: projectTypeId,
      })),
    },
  ]
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected database error occurred.'
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
      return supabase.from('project_targets').delete().eq('project_id', projectId)
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
