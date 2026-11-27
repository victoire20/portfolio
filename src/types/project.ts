export interface Project {
    id: number | string
    title: string
    description: string
    skills: string[]
    cover?: string
    gallery?: string[]
    liveUrl?: string
    githubUrl?: string
    isPrivate: boolean
    maquette: {
        support: string | null
        url: string | null
    }
    isSmallProject: boolean
}