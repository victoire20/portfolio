import { useTranslation } from 'react-i18next'
import FunFactImg from '../assets/my fun facts.png'
import ImgAbout from '../assets/profile.png'

import AboutSection from '../components/sections/AboutSection'
import PageHeaderSection from '../components/sections/PageHeaderSection'
import useActiveSkills from '../hooks/useActiveSkills'
import { skillCategoryFallbacks, skillCategoryTranslationKeys } from '../types/skill'

export default function About() {
    const { t } = useTranslation()
    const { groups, loading, error } = useActiveSkills()
    const aboutSkillTypes = ['languages', 'other', 'tools', 'databases', 'frameworks']
    const aboutSkillGroups = aboutSkillTypes.flatMap((type) =>
        groups.filter((group) => group.type === type && group.items.length > 0),
    )

    return <>
        <main className='container page-decor page-decor--about'>
            <PageHeaderSection title='about-me' content={t('about.first_sentence')} />
            <AboutSection hasTitle={false}>
                <div className="section__body">
                    <div className="section__body__content">
                        <div className="text__content">
                            <p>{t('about.first_paragraph')}</p>
                            <p>{t('about.second_paragraph')}</p>
                            <p>{t('about.third_paragraph')}</p>
                        </div>
                    </div>
                    <div className="section__image max-w-85.75 max-h-127">
                        <img src={ImgAbout} alt="section image" />
                    </div>
                </div>
            </AboutSection>

            <section className="row about-skills">
                <div className="section__title">
                    <div className="section__title__text">
                        <h2><span className="tag">#</span>{t('skills.title')}</h2>
                    </div>
                </div>
                <div className="about-skills__grid" aria-busy={loading}>
                    {error && <p role="alert">Could not load skills: {error}</p>}
                    {loading && <p role="status">Loading skills…</p>}
                    {!loading && !error && aboutSkillGroups.map((group) => (
                        <div className="skill__item" key={group.type}>
                            <div className="skills__designation">
                                {t(skillCategoryTranslationKeys[group.type], {
                                    defaultValue: skillCategoryFallbacks[group.type],
                                })}
                            </div>
                            <div className="skills__list">
                                {group.items.map((skill, index) => (
                                    <span key={`${skill}-${index}`}>{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
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
                    <div className="line__div fun__fact max-w-[605px]">
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
