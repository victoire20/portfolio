
import { useTranslation } from 'react-i18next'
import ProjectSection from '../components/sections/ProjectSection'
import PageHeaderSection from '../components/sections/PageHeaderSection'
import ProjectCard from '../components/card/ProjectCard'
import usePublicProjects from '../hooks/usePublicProjects'


export default function Projects() {
    const { t, i18n } = useTranslation()
    const { projects, loading, error } = usePublicProjects(i18n.language)

    return <>
        <main className='container page-decor page-decor--projects'>
            <PageHeaderSection title={t('projects.title')} content={t('projects.first_sentence')} />
            <ProjectSection id='projects' className='row' title={t('projects.first_subtitle')} hasBar={false} hasMoreBtn={false}>
                {error && <p role="alert">Could not load projects: {error}</p>}
                {loading && <p role="status">Loading projects…</p>}
                {!loading && !error && projects.length === 0 && <p>No projects available.</p>}
                {!loading && !error && projects.map((project) => (
                    !project.isSmallProject && <ProjectCard key={project.id} data={project} />
                ))}
            </ProjectSection>

            <ProjectSection className="last_row skill" id="skill" title={t('projects.second_subtitle')} hasBar={false} hasMoreBtn={false}>
                {!loading && !error && projects.map((project) => (
                    project.isSmallProject && <ProjectCard key={project.id} data={project} />
                ))}
            </ProjectSection>
        </main>
    </>
}