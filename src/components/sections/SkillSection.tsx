import { useTranslation } from 'react-i18next'
import GroupSquare from '../../assets/group-square.png'


export default function SkillSection() {
    const { t } = useTranslation()

    return (
        <section className="row" id="skill">
            <div className="section__title">
                <div className="section__title__text">
                    <h2 className="lowercase"><span className="tag">#</span>{t('skills.title')}</h2>
                    <div className="section__bar"></div>
                </div>
            </div>
            <div className="section__body">
                <div className="section__image">
                    <img src={GroupSquare} alt="section image" />
                </div>
                <div className="skills__layout">
                    <div className="skills__layout">
                        <div className="col">
                            <div className="skill__item">
                                <div className="skills__designation">{t('skills.languages')}</div>
                                <div className="skills__list">
                                    <span>Python</span> <span>JavaScript</span> <span>PhP</span> <span>SQL</span>
                                </div>
                            </div>
                        </div>
                            <div className="col">
                            <div className="skill__item">
                                <div className="skills__designation">{t('skills.databases')}</div>
                                <div className="skills__list">
                                    <span>PostgresSQL</span> <span>MySQL</span> <span>SQLite</span> <span>NOSQL</span> <span>Redis</span>
                                </div>
                            </div>
                            <div className="skill__item">
                                <div className="skills__designation">{t('skills.others')}</div>
                                <div className="skills__list">
                                    <span>HTML</span> <span>CSS</span> <span>Jquery</span> <span>REST API / JWT</span> <span>Swagger / OpenAPI</span> <span>Jinja</span>
                                </div>
                            </div>
                            </div>
                            <div className="col">
                            <div className="skill__item">
                                <div className="skills__designation">{t('skills.tools')}</div>
                                <div className="skills__list">
                                    <span>Git / GitHub</span> <span>Docker</span> <span>CI/CD</span> <span>Postman</span> <span>VSCode</span> <span>Linux / IntelliJ IDEA</span>
                                </div>
                            </div>
                            <div className="skill__item">
                                <div className="skills__designation">Frameworks</div>
                                <div className="skills__list">
                                    <span>Django</span> <span>FastAPI</span> <span>React</span> <span>Laravel</span> <span>Bootstrap</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}