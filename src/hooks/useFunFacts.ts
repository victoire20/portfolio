import { useEffect, useState } from 'react'

type FunFactRecord = {
  id: unknown
  content: unknown
  translations: unknown
}

export type FunFact = {
  id: number | string
  content: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

export default function useFunFacts(language: string) {
  const [facts, setFacts] = useState<FunFact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true

    async function loadFunFacts() {
      const { supabase } = await import('../utils/supabase')
      const { data, error: queryError } = await supabase
        .from('funfacts')
        .select('id, content, translations')
        .order('id')
        .overrideTypes<FunFactRecord[]>()

      if (!isCurrent) return
      if (queryError) {
        setError(queryError.message)
      } else {
        try {
          const locale = language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
          setFacts((data ?? []).map((record) => {
            if (typeof record.id !== 'number' && typeof record.id !== 'string') {
              throw new Error('A fun fact has an invalid id.')
            }

            const translations = isRecord(record.translations) ? record.translations : {}
            const french = isRecord(translations.fr) ? readString(translations.fr.content) : null
            const english = isRecord(translations.en) ? readString(translations.en.content) : null
            const defaultContent = readString(record.content)
            const content = locale === 'fr'
              ? french || defaultContent || english
              : english || french || defaultContent

            if (!content?.trim()) {
              throw new Error('A fun fact has no valid content.')
            }

            return { id: record.id, content }
          }))
        } catch (mappingError) {
          setError(mappingError instanceof Error ? mappingError.message : 'Fun fact data is invalid.')
        }
      }
      setLoading(false)
    }

    setLoading(true)
    setError(null)
    loadFunFacts().catch((loadError: unknown) => {
      if (!isCurrent) return
      setError(loadError instanceof Error ? loadError.message : 'An unexpected error occurred.')
      setLoading(false)
    })

    return () => {
      isCurrent = false
    }
  }, [language])

  return { facts, loading, error }
}
