
import { useTranslation } from 'react-i18next'
import ProjectSection from '../components/sections/ProjectSection'
import PageHeaderSection from '../components/sections/PageHeaderSection'
import { projects } from '../data/projects'

import ProjectCard from '../components/card/ProjectCard'


export default function Projects() {
    const { t } = useTranslation()

    return <>
        <main>
            <PageHeaderSection title={t('projects.title')} content={t('projects.first_sentence')} />

            <ProjectSection id='projects' className='row' title={t('projects.first_subtitle')} hasBar={false} hasMoreBtn={false}>                
                {projects.map((project) => !project.isSmallProject && <ProjectCard key={project.id} data={project} />)}
            </ProjectSection>

            <ProjectSection className="last_row skill" id="skill" title={t('projects.second_subtitle')} hasBar={false} hasMoreBtn={false}>
                {projects.map((project) => project.isSmallProject && <ProjectCard key={project.id} data={project} />)}
            </ProjectSection>
        </main>
    </>
}