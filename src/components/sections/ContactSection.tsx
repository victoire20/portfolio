import { useTranslation } from "react-i18next"
import { Icons } from "../../icons"

export default function ContactSection() {
    const { t } = useTranslation()

    return (
        <section className="last_row" id="contact">
            <div className="section__title">
                <div className="section__title__text">
                    <h2><span className="tag">#</span>contacts</h2>
                    <div className="md:h-0.5 md:w-30  md:bg-(--purple-soft)"></div>
                </div>
            </div>
            <div className="section__body">
                <div className="section__body__content">
                    <div className="text__content">
                        <p>
                            {t('home.contact_content')}
                        </p>
                    </div>
                </div>
                <div className="section__image">
                    <div className="contact__infos">
                        <p className="contact__infos__title">{t('home.call_to_action')}</p>
                        <div className="contact__infos__content">
                            <a href="#" className="flex flex-row items-center"><img src={Icons.discord} alt="discord icon" />
                                <span>!Elias#3519</span>
                            </a>
                            <a href="mailto:gauisyaba@gmail.com" className="flex flex-row items-center"><img src={Icons.email} alt="email icon" />
                                <span>gauisyaba@gmail.com</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}