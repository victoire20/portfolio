export type SkillType = "Languages" | "Databases" | "Tools" | "Other" | "Frameworks"

export const skillCategories = ['languages', 'databases', 'other', 'tools', 'frameworks'] as const

export type SkillCategory = typeof skillCategories[number]

export interface Skill {
    id: number
    type: SkillType
    items?: string[]
}