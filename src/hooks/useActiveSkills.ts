import { useEffect, useState } from 'react'
import { skillCategories, type SkillCategory } from '../types/skill'

type SkillRecord = {
  id: number | string
  libelle: string
  type: SkillCategory
  is_active: boolean
}

export type SkillGroup = {
  type: SkillCategory
  items: string[]
}

export default function useActiveSkills() {
  const [groups, setGroups] = useState<SkillGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadSkills() {
      const { supabase } = await import('../utils/supabase')
      const { data, error: queryError } = await supabase
        .from('skills')
        .select('id, libelle, type, is_active')
        .eq('is_active', true)
        .order('id')
        .overrideTypes<SkillRecord[]>()

      if (!isCurrent) return
      if (queryError) {
        setError(queryError.message)
      } else {
        const groupedSkills = new Map<SkillCategory, string[]>(
          skillCategories.map((type) => [type, []]),
        )

        for (const skill of data ?? []) {
          if (
            typeof skill.libelle !== 'string'
            || !skill.libelle.trim()
            || !skillCategories.includes(skill.type)
          ) {
            setError('The skills table contains an invalid record.')
            setLoading(false)
            return
          }
          groupedSkills.get(skill.type)?.push(skill.libelle)
        }

        setGroups(skillCategories.map((type) => ({
          type,
          items: groupedSkills.get(type) ?? [],
        })))
      }
      setLoading(false)
    }

    loadSkills().catch((loadError: unknown) => {
      if (!isCurrent) return
      setError(loadError instanceof Error ? loadError.message : 'An unexpected error occurred.')
      setLoading(false)
    })

    return () => {
      isCurrent = false
    }
  }, [])

  return { groups, loading, error }
}
