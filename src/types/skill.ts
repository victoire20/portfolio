export type SkillType = "Languages" | "Databases" | "Tools" | "Other" | "Frameworks"

export const skillCategories = ['languages', 'databases', 'other', 'tools', 'frameworks'] as const

export type SkillCategory = typeof skillCategories[number]

export const skillCategoryTranslationKeys = {
    languages: 'skills.languages',
    databases: 'skills.databases',
    other: 'skills.others',
    tools: 'skills.tools',
    frameworks: 'skills.frameworks',
} as const satisfies Record<SkillCategory, string>

export const skillCategoryFallbacks: Record<SkillCategory, string> = {
    languages: 'Languages',
    databases: 'Databases',
    other: 'Others',
    tools: 'Tools',
    frameworks: 'Frameworks',
}

export interface Skill {
    id: number
    type: SkillType
    items?: string[]
}