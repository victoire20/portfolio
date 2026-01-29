export type SkillType = "Languages" | "Databases" | "Tools" | "Other" | "Frameworks"

export interface Skill {
    id: number
    type: SkillType
    items?: string[]
}