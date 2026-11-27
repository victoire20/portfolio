import AboutSection from "../components/sections/AboutSection"
import ContactSection from "../components/sections/ContactSection"
import HeroSection from "../components/sections/HeroSection"
import ProjectSection from "../components/sections/ProjectSection"
import QuotationSection from "../components/sections/QuotationSection"
import SkillSection from "../components/sections/SkillSection"
import { useTranslation } from "react-i18next"
import ProjectCard from "../components/card/ProjectCard"
import usePublicProjects from "../hooks/usePublicProjects"

import Button from "../components/ui/button"

import ImgAbout from '../assets/profile.png'

export default function Home() {
    const { t, i18n } = useTranslation()
    const { projects, loading, error } = usePublicProjects(i18n.language)
    const featuredProjects = projects.filter((project) => !project.isSmallProject).slice(0, 3)

    return <>
            <main className="container page-decor page-decor--home">
                <HeroSection />
                <QuotationSection />
                <ProjectSection id="projects" className="row medium-square-right" title={t('home.projects_title')} hasBar={true} hasMoreBtn={true}>
                    {error && <p role="alert">Could not load projects: {error}</p>}
                    {loading && <p role="status">Loading projects…</p>}
                    {!loading && !error && featuredProjects.map((project) => <ProjectCard key={project.id} data={project} />)}
                </ProjectSection>
                <SkillSection />
                <AboutSection hasBar={true}>
                    <div className="flex flex-col-reverse md:flex-row lg:justify-between lg:items-center gap-8">
                        <div className="section__body__content">
                            <div className="text__content">
                                <p>{t('home.about_p1')}</p>
                                <p>{t('home.about_p2')}</p>
                                <p>{t('home.about_p3')}</p>
                            </div>
                            <Button url='/about' className='btn btn__about'>{t('home.read_more')}</Button>
                        </div>
                        <div className="mb-8 flex justify-center md:block">
                            <img
                                src={ImgAbout}
                                alt="section image"
                                className="w-auto h-auto max-w-84.75 max-h-126.75"
                            />
                        </div> 
                    </div>                   
                </AboutSection>
                <ContactSection />
            </main>
        </>    
}
