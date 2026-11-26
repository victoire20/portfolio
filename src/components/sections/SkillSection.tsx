import { useTranslation } from 'react-i18next'
import GroupSquare from '../../assets/group-square.png'
import useActiveSkills from '../../hooks/useActiveSkills'

export default function SkillSection() {
    const { t } = useTranslation()
    const { groups, loading, error } = useActiveSkills()
    const columns = [
        groups.filter((group) => group.type === 'languages'),
        groups.filter((group) => group.type === 'databases' || group.type === 'other'),
        groups.filter((group) => group.type === 'tools' || group.type === 'frameworks'),
    ]

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
                <div className="skills__layout">
                    <div className="skills__layout">
                        {error && <p role="alert">Could not load skills: {error}</p>}
                        {loading && <p role="status">Loading skills…</p>}
                        {!loading && !error && columns.map((column, columnIndex) => (
                            <div className="col" key={columnIndex}>
                                {column.filter((group) => group.items.length > 0).map((group) => (
                                    <div className="skill__item" key={group.type}>
                                        <div className="skills__designation">
                                            {group.type[0].toUpperCase() + group.type.slice(1)}
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
                </div>
            </div>
        </section>
    )
}