import { useEffect, useState } from 'react'
import type { CatalogItem } from '../components/admin/ProjectCatalogPage'
import type { AdminProject, ProjectStatus } from '../types/adminProject'

type ProjectRecord = {
  id: unknown
  title: unknown
  description: unknown
  cover: unknown
  isPrivate: unknown
  liveUrl: unknown
  githubUrl: unknown
  maquette: unknown
  isSmallProject: unknown
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readId(value: unknown): CatalogItem['id'] | null {
  return typeof value === 'number' || typeof value === 'string' ? value : null
}

function readOptionalString(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') throw new Error('A project contains an invalid text field.')
  return value
}

function readStatus(value: unknown): ProjectStatus | null {
  return value === 'Done' || value === 'In progress' ? value : null
}

function readTranslatedStatus(translations: unknown, locale: 'fr' | 'en') {
  if (!isRecord(translations) || !isRecord(translations[locale])) return null
  const status = translations[locale].status
  return typeof status === 'string' && status.trim() ? status : null
}

function readTranslation(translations: unknown, locale: 'fr' | 'en', description: string, status: ProjectStatus) {
  const translation = isRecord(translations) && isRecord(translations[locale])
    ? translations[locale]
    : {}
  return {
    description: readOptionalString(translation.description) ?? description,
    status: readTranslatedStatus(translations, locale) ?? status,
  }
}

function readMaquette(value: unknown) {
  if (value === null || value === undefined) return { support: null, url: null }
  if (!isRecord(value)) throw new Error('A project has invalid maquette data.')
  return {
    support: readOptionalString(value.support),
    url: readOptionalString(value.url),
  }
}

export default function useAdminProjects(projectId?: string | null, enabled = true) {
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    let isCurrent = true

    async function loadProjects() {
      const { supabase } = await import('../utils/supabase')
      let projectQuery = supabase
        .from('projects')
        .select('id, title, description, cover, isPrivate, liveUrl, githubUrl, maquette, isSmallProject, started_at, ended_at, status, translations')
        .order('id', { ascending: false })
      if (projectId) projectQuery = projectQuery.eq('id', projectId)
      const { data, error: projectError } = await projectQuery.overrideTypes<ProjectRecord[]>()

      if (projectError) throw new Error(projectError.message)

      const projectRows = data ?? []
      const mappedProjects = projectRows.map((record): AdminProject => {
        const id = readId(record.id)
        const status = readStatus(record.status)
        if (
          id === null
          || typeof record.title !== 'string'
          || !record.title.trim()
          || typeof record.description !== 'string'
          || !status
          || typeof record.isPrivate !== 'boolean'
          || typeof record.isSmallProject !== 'boolean'
        ) {
          throw new Error('The projects table contains an invalid record.')
        }
        const liveUrl = readOptionalString(record.liveUrl)
        const githubUrl = readOptionalString(record.githubUrl)

        return {
          id,
          title: record.title,
          description: record.description,
          cover: readOptionalString(record.cover),
          isPrivate: record.isPrivate,
          liveUrl,
          githubUrl,
          maquette: readMaquette(record.maquette),
          isSmallProject: record.isSmallProject,
          started_at: readOptionalString(record.started_at),
          ended_at: readOptionalString(record.ended_at),
          status,
          translations: {
            fr: readTranslation(record.translations, 'fr', record.description, status),
            en: readTranslation(record.translations, 'en', record.description, status),
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
  }, [enabled, projectId])

  function replaceProject(updatedProject: AdminProject) {
    setProjects((current) => current.map((project) => (
      project.id === updatedProject.id ? updatedProject : project
    )))
  }

  function removeProject(id: CatalogItem['id']) {
    setProjects((current) => current.filter((project) => project.id !== id))
  }

  return { projects, loading, error, replaceProject, removeProject }
}
