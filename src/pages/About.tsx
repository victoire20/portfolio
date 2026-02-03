import { useTranslation } from 'react-i18next'
import FunFactImg from '../assets/my fun facts.png'
import ImgAbout from '../assets/about-1.png'

import AboutSection from '../components/sections/AboutSection'
import PageHeaderSection from '../components/sections/PageHeaderSection'

export default function About() {
    const { t } = useTranslation()

    return <>
        <main>
            <PageHeaderSection title='about-me' content={t('about.first_sentence')} />
            <AboutSection>
                <div className="section__body__content">
                    <div className="text__content">
                        <p>{t('about.first_paragraph')}</p>
                        <p>{t('about.second_paragraph')}</p>
                        <p>{t('about.third_paragraph')}</p>
                    </div>
                </div>
                <div className="section__image">
                    <img src={ImgAbout} alt="section image" />
                </div>
            </AboutSection>

            <section className="row">
                <div className="section__title">
                    <div className="section__title__text">
                        <h2><span className="tag">#</span>{t('skills.title')}</h2>
                    </div>
                </div>
                <div className="section__body">
                    <div className="line__div">
                        <div className="skill__item">
                            <div className="skills__designation">{t('skills.languages')}</div>
                            <div className="skills__list">
                                <span>Python</span> <span>PhP</span> <span>SQL</span> <span>JavaScript</span>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skills__designation">{t('skills.others')}</div>
                            <div className="skills__list">
                                <span>HTML</span> <span>CSS</span> <span>Jquery</span> <span>REST</span> <span>Jinja</span> <span>JWT</span>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skills__designation">{t('skills.tools')}</div>
                            <div className="skills__list">
                                <span>VSCode</span> <span>Linux</span> <span>Figma</span> <span>IntelliJ</span> <span>IDEA</span> 
                                <span>Git</span> <span>Github Action</span> <span>Docker</span> <span>Postman</span> <span>CPanel</span> 
                                <span>SMTP</span> <span>Swagger</span> <span>Swagger UI</span> <span>OpenAPI</span>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skills__designation">{t(('skills.databases'))}</div>
                            <div className="skills__list">
                                <span>SQLite</span> <span>PostgresSQL</span> <span>MySQL</span>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skills__designation">Frameworks</div>
                            <div className="skills__list">
                                <span>React</span> <span>Django</span> <span>FastAPI</span> <span>Laravel</span> <span>Bootstrap</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="last_row">
                <div className="section__title">
                    <div className="section__title__text">
                        <h2><span className="tag">#</span>{t('about.fun_facts_title')}</h2>
                        <div className="section__bar"></div>
                    </div>
                </div>
                <div className="section__body section__fact">
                    <div className="line__div fun__fact">
                        <div className="fact__item">{t('about.fun_facts_p1')}</div>
                        <div className="fact__item">{t('about.fun_facts_p2')}</div>
                        <div className="fact__item">{t('about.fun_facts_p3')}</div>
                        <div className="fact__item">{t('about.fun_facts_p4')}</div>
                        <div className="fact__item">{t('about.fun_facts_p5')}</div>
                    </div>
                    <div className="section__image hide__image">
                        <img src={FunFactImg} alt="section image" />
                    </div>
                </div>
            </section>
        </main>
    </>
}
