import { useTranslation } from 'react-i18next'
import GroupSquare from '../../assets/group-square.png'
import useActiveSkills from '../../hooks/useActiveSkills'
import { skillCategoryFallbacks, skillCategoryTranslationKeys } from '../../types/skill'

export default function SkillSection() {
    const { t } = useTranslation()
    const { groups, loading, error } = useActiveSkills()
    const skillColumns = [
        ['languages'],
        ['databases', 'other'],
        ['tools', 'frameworks'],
    ].map((types) => types.flatMap((type) => groups.filter((group) => group.type === type)))

    return (
        <section className="row" id="skill">
            <div className="section__title">
                <div className="section__title__text">
                    <h2 className="lowercase"><span className="tag">#</span>{t('skills.title')}</h2>
                    <div className="md:h-0.5 md:w-50  md:bg-(--purple-soft)"></div>
                </div>
            </div>
            <div className="section__body">
                <div className="section__image">
                    <img src={GroupSquare} alt="section image" />
                </div>
                <div className="home-skills__layout">
                    {error && <p role="alert">Could not load skills: {error}</p>}
                    {loading && <p role="status">Loading skills…</p>}
                    {!loading && !error && (
                        <div className="home-skills__columns">
                            {skillColumns.map((column, columnIndex) => (
                                <div className="home-skills__column" key={columnIndex}>
                                    {column.filter((group) => group.items.length > 0).map((group) => (
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
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}