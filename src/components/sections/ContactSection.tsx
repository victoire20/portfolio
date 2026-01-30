import { Icons } from "../../icons"

export default function ContactSection() {
    return (
        <section className="last_row" id="contact">
            <div className="section__title">
                <div className="section__title__text">
                    <h2><span className="tag">#</span>contacts</h2>
                    <div className="section__bar"></div>
                </div>
            </div>
            <div className="section__body">
                <div className="section__body__content">
                    <div className="text__content">
                        <p>
                            I’m interested in freelance opportunities. However, if you have other request or question, don’t hesitate to contact me
                        </p>
                    </div>
                </div>
                <div className="section__image">
                    <div className="contact__infos">
                        <p className="contact__infos__title">Message me here</p>
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