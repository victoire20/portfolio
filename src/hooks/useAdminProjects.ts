import { useEffect, useState } from 'react'
import type { CatalogItem } from '../components/admin/ProjectCatalogPage'

type ProjectStatus = 'In progress' | 'Done'

type ProjectRecord = {
  id: unknown
  title: unknown
  cover: unknown
  started_at: unknown
  ended_at: unknown
  status: unknown
  translations: unknown
}

type ProjectSkillLink = {
  project_id: unknown
  skill_id: unknown
}

type ProjectTargetLink = {
  project_id: unknown
  target_id: unknown
}

type ProjectTypeLink = {
  project_id: unknown
  project_type_id: unknown
}

export type AdminProject = {
  id: CatalogItem['id']
  title: string
  cover: string | null
  startedAt: string | null
  endedAt: string | null
  status: ProjectStatus
  translatedStatus: { fr: string | null; en: string | null }
  skillIds: CatalogItem['id'][]
  targetIds: CatalogItem['id'][]
  projectTypeIds: CatalogItem['id'][]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readId(value: unknown): CatalogItem['id'] | null {
  return typeof value === 'number' || typeof value === 'string' ? value : null
}

function readOptionalString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  return typeof value === 'string' ? value : null
}

function readStatus(value: unknown): ProjectStatus | null {
  return value === 'Done' || value === 'In progress' ? value : null
}

function readTranslatedStatus(translations: unknown, locale: 'fr' | 'en') {
  if (!isRecord(translations) || !isRecord(translations[locale])) return null
  const status = translations[locale].status
  return typeof status === 'string' && status.trim() ? status : null
}

export default function useAdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadProjects() {
      const { supabase } = await import('../utils/supabase')
      const { data, error: projectError } = await supabase
        .from('projects')
        .select('id, title, cover, started_at, ended_at, status, translations')
        .order('id', { ascending: false })
        .overrideTypes<ProjectRecord[]>()

      if (projectError) throw new Error(projectError.message)

      const projectRows = data ?? []
      const mappedProjects = projectRows.map((record): AdminProject => {
        const id = readId(record.id)
        const status = readStatus(record.status)
        if (id === null || typeof record.title !== 'string' || !record.title.trim() || !status) {
          throw new Error('The projects table contains an invalid record.')
        }
        if (
          record.cover !== null && record.cover !== undefined && typeof record.cover !== 'string'
        ) {
          throw new Error('A project has an invalid cover URL.')
        }
        if (
          record.started_at !== null && record.started_at !== undefined && typeof record.started_at !== 'string'
        ) {
          throw new Error('A project has an invalid start date.')
        }
        if (
          record.ended_at !== null && record.ended_at !== undefined && typeof record.ended_at !== 'string'
        ) {
          throw new Error('A project has an invalid end date.')
        }

        return {
          id,
          title: record.title,
          cover: readOptionalString(record.cover),
          startedAt: readOptionalString(record.started_at),
          endedAt: readOptionalString(record.ended_at),
          status,
          translatedStatus: {
            fr: readTranslatedStatus(record.translations, 'fr'),
            en: readTranslatedStatus(record.translations, 'en'),
          },
          skillIds: [],
          targetIds: [],
          projectTypeIds: [],
        }
      })

      if (mappedProjects.length === 0) {
        if (isCurrent) setProjects([])
        return
      }

      const [skillsResponse, targetsResponse, typesResponse] = await Promise.all([
        supabase
          .from('project_skills')
          .select('project_id, skill_id')
          .overrideTypes<ProjectSkillLink[]>(),
        supabase
          .from('project_targets')
          .select('project_id, target_id')
          .overrideTypes<ProjectTargetLink[]>(),
        supabase
          .from('project_project_types')
          .select('project_id, project_type_id')
          .overrideTypes<ProjectTypeLink[]>(),
      ])

      const associationError = skillsResponse.error ?? targetsResponse.error ?? typesResponse.error
      if (associationError) throw new Error(associationError.message)

      const projectsById = new Map(mappedProjects.map((project) => [String(project.id), project]))
      for (const link of skillsResponse.data ?? []) {
        const projectId = readId(link.project_id)
        const skillId = readId(link.skill_id)
        const project = projectId === null ? undefined : projectsById.get(String(projectId))
        if (!project || skillId === null) throw new Error('The project skills relations contain an invalid record.')
        project.skillIds.push(skillId)
      }
      for (const link of targetsResponse.data ?? []) {
        const projectId = readId(link.project_id)
        const targetId = readId(link.target_id)
        const project = projectId === null ? undefined : projectsById.get(String(projectId))
        if (!project || targetId === null) throw new Error('The project targets relations contain an invalid record.')
        project.targetIds.push(targetId)
      }
      for (const link of typesResponse.data ?? []) {
        const projectId = readId(link.project_id)
        const projectTypeId = readId(link.project_type_id)
        const project = projectId === null ? undefined : projectsById.get(String(projectId))
        if (!project || projectTypeId === null) throw new Error('The project types relations contain an invalid record.')
        project.projectTypeIds.push(projectTypeId)
      }

      if (isCurrent) setProjects(mappedProjects)
    }

    setLoading(true)
    setError(null)
    loadProjects()
      .catch((loadError: unknown) => {
        if (!isCurrent) return
        setError(loadError instanceof Error ? loadError.message : 'An unexpected error occurred.')
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [])

  return { projects, loading, error }
}
