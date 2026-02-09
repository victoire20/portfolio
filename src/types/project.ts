export interface Project {
    id: number
    title: string
    description: string
    skills: string[]
    cover?: string
    gallery?: string[]
    liveUrl?: string
    githubUrl?: string
    isPrivate: boolean
    maquette: Object
    isSmallProject: boolean
}