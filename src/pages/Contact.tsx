import { Icons } from "../icons"
import AboutSection from "../components/sections/AboutSection"
import PageHeaderSection from '../components/sections/PageHeaderSection'

export default function Contact() {
    return <>
        <main>
            <PageHeaderSection title='contacts' content='Don’t hesitate to get in touch!' />
            <AboutSection id="about">
                <div className="section__body__content">
                    <div className="text__content">
                        <p>
                            Open to freelance opportunities or any questions. Don’t hesitate to get in touch!
                        </p>
                    </div>
                </div>
                <div className="section__image">
                        <div className="contact__infos">
                        <p className="contact__infos__title">Message me here</p>
                        <div className="contact__infos__content">
                            <a href="#" className="flex flex-row items-center"><img src={Icons.discord} alt="discord icon" /><span>!Elias#3519</span></a>
                            <a href="#" className="flex flex-row items-center"><img src={Icons.email} alt="email icon" /><span>elias@elias.me</span></a>
                        </div>
                    </div>
                </div>
            </AboutSection>
            <section className="last_row" id="allmedia">
                <div className="section__title">
                    <div className="section__title__text">
                        <h2><span className="tag">#</span>all-media</h2>
                        <div className="section__bar"></div>
                    </div>
                </div>
                <div className="section__body">
                    <div className="section__body__content">
                        <div className="text__content">
                            <ul className="dflex">
                                <li>
                                    <a href="#">
                                        <img src={Icons.twitter} alt="twitter icon" />
                                        <span>@elias</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#">
                                        <img src={Icons.twitter} alt="twitter icon" />
                                        <span>@elias</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </>
}
