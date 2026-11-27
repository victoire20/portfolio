export type ProjectStatus = 'In progress' | 'Done'

export type ProjectTranslation = {
  description: string
  status: string
}

export type AdminProject = {
  id: number | string
  title: string
  description: string
  cover: string | null
  isPrivate: boolean
  liveUrl: string | null
  githubUrl: string | null
  maquette: {
    support: string | null
    url: string | null
  }
  isSmallProject: boolean
  started_at: string | null
  ended_at: string | null
  status: ProjectStatus
  translations: {
    fr: ProjectTranslation
    en: ProjectTranslation
  }
  skillIds: (number | string)[]
  targetIds: (number | string)[]
  projectTypeIds: (number | string)[]
}
