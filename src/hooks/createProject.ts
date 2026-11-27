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
  rows: {
    project_id: CatalogItem['id']
    relation_id: CatalogItem['id']
  }[]
}

type ProjectRelationRecord = {
  id: CatalogItem['id']
  relationId: CatalogItem['id']
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
      rows: input.skillIds.map((skillId) => ({ project_id: projectId, relation_id: skillId })),
    },
    {
      table: 'project_targets',
      rows: input.targetIds.map((targetId) => ({ project_id: projectId, relation_id: targetId })),
    },
    {
      table: 'project_project_types',
      rows: input.projectTypeIds.map((projectTypeId) => ({
        project_id: projectId,
        relation_id: projectTypeId,
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
    await syncProjectRelations(project.id, input)
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
      await syncProjectRelations(project.id, projectToInput(project))
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

async function syncProjectRelations(projectId: CatalogItem['id'], input: CreateProjectInput) {
  const { supabase } = await import('../utils/supabase')

  for (const group of getRelationGroups(projectId, input)) {
    const existing = await loadProjectRelations(group, projectId)
    const desiredRows = [...new Map(
      group.rows.map((row) => [String(row.relation_id), row]),
    ).values()]
    const desiredIds = new Set(desiredRows.map((row) => String(row.relation_id)))
    const retainedIds = new Set<string>()
    const duplicateOrRemovedRowIds: CatalogItem['id'][] = []

    for (const row of existing) {
      const relationKey = String(row.relationId)
      if (!desiredIds.has(relationKey) || retainedIds.has(relationKey)) {
        duplicateOrRemovedRowIds.push(row.id)
      } else {
        retainedIds.add(relationKey)
      }
    }

    if (duplicateOrRemovedRowIds.length > 0) {
      const { error } = await supabase
        .from(group.table)
        .delete()
        .eq('project_id', projectId)
        .in('id', duplicateOrRemovedRowIds)
      if (error) throw new Error(error.message)
    }

    const additions = desiredRows.filter((row) => !retainedIds.has(String(row.relation_id)))
    if (additions.length > 0) {
      const { error } = await insertRelation(group, additions)
      if (error) throw new Error(error.message)
    }
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
    await syncProjectRelations(projectId, input)
    return ''
  } catch (error) {
    return ` Rollback was incomplete: ${getErrorMessage(error)}.`
  }
}

function getRelationGroups(projectId: CatalogItem['id'], input: CreateProjectInput): RelationGroup[] {
  return [
    {
      table: 'project_skills',
      rows: input.skillIds.map((skillId) => ({ project_id: projectId, relation_id: skillId })),
    },
    {
      table: 'project_targets',
      rows: input.targetIds.map((targetId) => ({ project_id: projectId, relation_id: targetId })),
    },
    {
      table: 'project_project_types',
      rows: input.projectTypeIds.map((projectTypeId) => ({
        project_id: projectId,
        relation_id: projectTypeId,
      })),
    },
  ]
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected database error occurred.'
}

async function loadProjectRelations(
  group: RelationGroup,
  projectId: CatalogItem['id'],
): Promise<ProjectRelationRecord[]> {
  const { supabase } = await import('../utils/supabase')
  switch (group.table) {
    case 'project_skills': {
      const { data, error } = await supabase
        .from('project_skills')
        .select('id, skill_id')
        .eq('project_id', projectId)
        .overrideTypes<{ id: unknown; skill_id: unknown }[]>()
      if (error) throw new Error(error.message)
      return (data ?? []).map((row) => mapProjectRelation(row.id, row.skill_id, group.table))
    }
    case 'project_targets': {
      const { data, error } = await supabase
        .from('project_targets')
        .select('id, target_id')
        .eq('project_id', projectId)
        .overrideTypes<{ id: unknown; target_id: unknown }[]>()
      if (error) throw new Error(error.message)
      return (data ?? []).map((row) => mapProjectRelation(row.id, row.target_id, group.table))
    }
    case 'project_project_types': {
      const { data, error } = await supabase
        .from('project_project_types')
        .select('id, project_type_id')
        .eq('project_id', projectId)
        .overrideTypes<{ id: unknown; project_type_id: unknown }[]>()
      if (error) throw new Error(error.message)
      return (data ?? []).map((row) => mapProjectRelation(row.id, row.project_type_id, group.table))
    }
  }
}

function mapProjectRelation(
  id: unknown,
  relationId: unknown,
  table: RelationGroup['table'],
): ProjectRelationRecord {
  if (
    (typeof id !== 'number' && typeof id !== 'string')
    || (typeof relationId !== 'number' && typeof relationId !== 'string')
  ) {
    throw new Error(`The ${table} table contains an invalid relation.`)
  }
  return { id, relationId }
}

async function insertRelation(
  group: RelationGroup,
  rows: RelationGroup['rows'] = group.rows,
) {
  const { supabase } = await import('../utils/supabase')
  switch (group.table) {
    case 'project_skills':
      return supabase.from('project_skills').insert(rows.map(({ project_id, relation_id }) => ({
        project_id,
        skill_id: relation_id,
      })))
    case 'project_targets':
      return supabase.from('project_targets').insert(rows.map(({ project_id, relation_id }) => ({
        project_id,
        target_id: relation_id,
      })))
    case 'project_project_types':
      return supabase.from('project_project_types').insert(rows.map(({ project_id, relation_id }) => ({
        project_id,
        project_type_id: relation_id,
      })))
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
