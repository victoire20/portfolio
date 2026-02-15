import AboutSection from "../components/sections/AboutSection"
import ContactSection from "../components/sections/ContactSection"
import HeroSection from "../components/sections/HeroSection"
import ProjectSection from "../components/sections/ProjectSection"
import QuotationSection from "../components/sections/QuotationSection"
import SkillSection from "../components/sections/SkillSection"
import { useTranslation } from "react-i18next"
import { projects } from "../data/projects"
import ProjectCard from "../components/card/ProjectCard"

import Button from "../components/ui/button"

import ImgAbout from '../assets/profile.png'

export default function Home() {
    const { t } = useTranslation()

    return <>
            <main>
                <HeroSection />
                <QuotationSection />
                <ProjectSection id="projects" className="row medium-square-right" title={t('home.projects_title')} hasBar={true} hasMoreBtn={true}>
                    {projects.slice(0, 3).map((project) => !project.isSmallProject && <ProjectCard key={project.id} data={project} />)}
                </ProjectSection>
                <SkillSection />
                <AboutSection hasBar={true}>
                    <div className="section__body">
                        <div className="section__body__content">
                            <div className="text__content">
                                <p>{t('home.about_p1')}</p>
                                <p>{t('home.about_p2')}</p>
                                <p>{t('home.about_p3')}</p>
                            </div>
                            <Button url='/about' className='btn btn__about'>{t('home.read_more')}</Button>
                        </div>
                        <div className="section__image max-w-84.75 max-h-126.75">
                            <img src={ImgAbout} alt="section image" />
                        </div> 
                    </div>                   
                </AboutSection>
                <ContactSection />
            </main>
        </>    
}
