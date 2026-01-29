import type { Skill } from "../types/skill";

export const skills: Skill[] = [
    {
        id: 1,
        type: 'Languages',
        items: ['Python', 'JavaScript', 'PhP', 'SQL']
    },
    {
        id: 2,
        type: 'Databases',
        items: ['PostgresSQL', 'MySQL', 'SQLite', 'NOSQL', 'Redis']
    },
    {
        id: 3,
        type: 'Other',
        items: ['HTML', 'CSS', 'Jquery', 'SQL', 'REST API / JWT', 'Swagger / OpenAPI', 'Jinja']
    },
    {
        id: 4,
        type: 'Tools',
        items: ['Git / GitHub', 'Docker', 'CI/CD', 'Postman', 'VSCode', 'Linux', 'IntelliJ IDEA']
    },
    {
        id: 5,
        type: 'Frameworks',
        items: ['Django', 'FastAPI', 'React', 'Laravel', 'Bootstrap']
    }
]