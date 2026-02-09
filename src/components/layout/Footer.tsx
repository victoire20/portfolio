import { useTranslation } from 'react-i18next'
import Logo from '/Logo.png'
import { Icons } from '../../icons'

import './Footer.css'

export default function Footer() {
    const { t } = useTranslation()

    return (
        <footer className="text-[1rem]">
            <div className="container">
                <div className="md:flex justify-between md:items-center footer__content">
                    <div>
                        <div className="footer__contact">
                            <a href="#" className="footer__logo">
                                <img src={Logo} alt="footer logo" />
                                <span>Elias</span>
                            </a>
                            <span>gauisyaba@gmail.com</span>
                        </div>
                        <div className="footer__description">
                            <p>{t('footer.job_title')}</p>
                        </div>
                    </div>
                    <div className="footer__media">
                        <h4>Media</h4>
                        <div className="footer__media__icon">
                            <a href="https://github.com/victoire20" target="_blank"><img src={Icons.github} alt="github icon" /></a>
                            <a href="#"><img src={Icons.dribble} alt="dribble icon" /></a>
                            <a href="#"><img src={Icons.discord} alt="discord icon" /></a>
                        </div>
                    </div>
                </div>
                <p className="copyright">
                    &copy;{new Date().getFullYear()}. {t('footer.first_segment_content')}<a href="https://github.com/victoire20">Yaba J</a>.{t('footer.second_segment_content')}<a href="https://www.figma.com/@elias_dev">Elias</a>.
                </p>
            </div>
        </footer>
    )
}