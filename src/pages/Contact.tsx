import { useTranslation } from "react-i18next"
import { Icons } from "../icons"
import AboutSection from "../components/sections/AboutSection"
import PageHeaderSection from '../components/sections/PageHeaderSection'

export default function Contact() {
    const { t } = useTranslation()

    return <>
        <main>
            <PageHeaderSection title='contacts' content={t('contacts.title')} />
            <AboutSection id="about" hasTitle={false}>
                <div className="flex justify-between gap-8">
                    <div className="section__body__content">
                        <div className="text__content">
                            <p>{t('contacts.content')}</p>
                        </div>
                    </div>
                    <div className="section__image">
                            <div className="contact__infos">
                            <p className="contact__infos__title">{t('contacts.call_to_action')}</p>
                            <div className="contact__infos__content">
                                <a href="#" className="flex flex-row items-center"><img src={Icons.discord} alt="discord icon" /><span>!Elias#3519</span></a>
                                <a href="mailto:gauisyaba@gmail.com" className="flex flex-row items-center">
                                    <img src={Icons.email} alt="email icon" /><span>gauisyaba@gmail.com</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </AboutSection>
            <section className="last_row" id="allmedia">
                <div className="section__title">
                    <div className="section__title__text">
                        <h2><span className="tag">#</span>{t('contacts.subtitle')}</h2>
                        <div className="md:h-0.5 md:w-60  md:bg-(--purple-soft)"></div>
                    </div>
                </div>
                <div className="section__body">
                    <div className="section__body__content">
                        {/* <div className="text__content"> */}
                            <div className="flex items-center justify-center gap-5.5">
                                <a href="#" className="flex opacity-[0.7] hover:opacity-[1] hover:text-white">
                                    <img className="align-middle" src={Icons.twitter} alt="twitter icon" />
                                    <span className="">@elias</span>
                                </a>
                                <a href="#" className="flex opacity-[0.7] hover:opacity-[1] hover:text-white">
                                    <img className="align-middle" src={Icons.twitter} alt="twitter icon" />
                                    <span className="">@elias</span>
                                </a>
                            </div>
                        {/* </div> */}
                    </div>
                </div>
            </section>
        </main>
    </>
}
