import { useTranslation } from 'react-i18next'
import HeroImg from '../../assets/hero-image-1.png'
import Button from '../ui/button'

import './HeroSection.css'

export default function HeroSection() {
    const { t } = useTranslation()

    return (
        <section className="row hero" id="hero">
            <div className="hero__content max-w-134.25 max-h-56.75">
                <h1 className="hero__title">
                    {t('hero.welcome_before')}<span className="hero__stack"><span className="text__nowrap">full-stack</span>{t('hero.welcome_stack_suffix')}</span>{t('hero.welcome_middle')}<span className="hero__stack">{t('hero.welcome_stack_web')}</span>{t('hero.welcome_after_web')}<span className="hero__stack">{t('hero.welcome_stack_apis')}</span>
                </h1>
                <p className="hero__description">
                    {t('hero.subtitle')}
                </p>
                <div className="btn__group">                    
                    <Button className='btn' url='/contact'>{t('hero.contact_me')}</Button>
                    {/* <Button className='btn' url='#' download>{t('hero.resume_me')}</Button> */}
                </div>
            </div>
            <div className="hero__image max-w-117.25 max-h-96.5">
                <img src={HeroImg} alt="Hero Image" />
                <div className="hero__website__status max-w-100.5 mx-auto">
                    <div className="hero__website__status__dot"></div>
                    <div>{t('hero.status_first_segment')}<span className="website__designation">{t('hero.status_second_segment')}</span></div>
                </div>
            </div>
        </section>
    )
}