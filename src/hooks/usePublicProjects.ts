import { useEffect, useState } from 'react'
import type { Project } from '../types/project'

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
  translations: unknown
}

type ProjectSkillLink = {
  project_id: unknown
  skill_id: unknown
}

type SkillRecord = {
  id: unknown
  libelle: unknown
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readOptionalString(value: unknown) {
  if (value === null || value === undefined || value === '') return undefined
  if (typeof value !== 'string') throw new Error('A project contains an invalid text field.')
  return value
}

function readTranslation(translations: unknown, locale: 'fr' | 'en', fallback: string) {
  if (!isRecord(translations) || !isRecord(translations[locale])) return fallback
  const description = translations[locale].description
  return typeof description === 'string' && description.trim() ? description : fallback
}

function readMaquette(value: unknown): Project['maquette'] {
  if (value === null || value === undefined) return { support: null, url: null }
  if (!isRecord(value)) throw new Error('A project has invalid maquette data.')
  return {
    support: readOptionalString(value.support) ?? null,
    url: readOptionalString(value.url) ?? null,
  }
}

function readId(value: unknown): number | string {
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new Error('A project relation contains an invalid id.')
  }
  return value
}

export default function usePublicProjects(language: string) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadProjects() {
      const { supabase } = await import('../utils/supabase')
      const { data, error: projectError } = await supabase
        .from('projects')
        .select('id, title, description, cover, isPrivate, liveUrl, githubUrl, maquette, isSmallProject, translations')
        .eq('isPrivate', false)
        .order('id', { ascending: false })
        .overrideTypes<ProjectRecord[]>()

      if (projectError) throw new Error(projectError.message)

      const locale = language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
      const publicProjects = (data ?? []).map((record): Project => {
        const id = readId(record.id)
        if (
          typeof record.title !== 'string'
          || !record.title.trim()
          || typeof record.description !== 'string'
          || record.isPrivate !== false
          || typeof record.isSmallProject !== 'boolean'
        ) {
          throw new Error('The projects table contains an invalid public record.')
        }

        return {
          id,
          title: record.title,
          description: readTranslation(record.translations, locale, record.description),
          skills: [],
          cover: readOptionalString(record.cover),
          liveUrl: readOptionalString(record.liveUrl),
          githubUrl: readOptionalString(record.githubUrl),
          isPrivate: false,
          maquette: readMaquette(record.maquette),
          isSmallProject: record.isSmallProject,
        }
      })

      if (publicProjects.length === 0) {
        if (isCurrent) setProjects([])
        return
      }

      const projectIds = publicProjects.map((project) => project.id)
      const { data: links, error: linksError } = await supabase
        .from('project_skills')
        .select('project_id, skill_id')
        .in('project_id', projectIds)
        .overrideTypes<ProjectSkillLink[]>()
      if (linksError) throw new Error(linksError.message)

      const skillIds = [...new Set((links ?? []).map((link) => readId(link.skill_id)))]
      const skillLabelsById = new Map<string, string>()
      if (skillIds.length > 0) {
        const { data: skills, error: skillsError } = await supabase
          .from('skills')
          .select('id, libelle')
          .eq('is_active', true)
          .in('id', skillIds)
          .overrideTypes<SkillRecord[]>()
        if (skillsError) throw new Error(skillsError.message)

        for (const skill of skills ?? []) {
          if (typeof skill.libelle !== 'string' || !skill.libelle.trim()) {
            throw new Error('The skills table contains an invalid record.')
          }
          skillLabelsById.set(String(readId(skill.id)), skill.libelle)
        }
      }

      const projectsById = new Map(publicProjects.map((project) => [String(project.id), project]))
      for (const link of links ?? []) {
        const project = projectsById.get(String(readId(link.project_id)))
        const skill = skillLabelsById.get(String(readId(link.skill_id)))
        if (!project) throw new Error('A project skill relation refers to an unknown project.')
        if (skill) project.skills.push(skill)
      }

      if (isCurrent) setProjects(publicProjects)
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
  }, [language])

  return { projects, loading, error }
}
