import { useTranslation } from 'react-i18next'
import Logo from '/Logo.png'
import { Icons } from '../../icons'

import './Footer.css'

export default function Footer() {
    const { t } = useTranslation()

    return (
        <footer className="text-[1rem]">
            <div className="container">
                <div className="mb-8 md:flex justify-between md:items-center">
                    <div className='mb-4 md:mb-0'>
                        <div className="flex mb-4 gap-6">
                            <a href="#" className="flex items-center gap-[0.563rem]">
                                <img className='w-4 h-4' src={Logo} alt="footer logo" />
                                <span className='text-white font-(--font-medium)'>Elias</span>
                            </a>
                            <span>gauisyaba@gmail.com</span>
                        </div>
                        <div className="text-white">
                            <p className='leading-[1.4]'>{t('footer.job_title')}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center mt-0 md:mt-4 footer__media">
                        <h4 className='mb-75 font-(--font-medium) f-h4 text-white'>Media</h4>
                        <div className="flex gap-[0.688rem]">
                            <a className='hover:scale-[1.3]' href="https://github.com/victoire20" target="_blank"><img className='opacity-70 hover:opacity-100 w-5 h-5' src={Icons.github} alt="github icon" /></a>
                            <a className='hover:scale-[1.3]' href="#"><img className='opacity-70 hover:opacity-100 w-5 h-5' src={Icons.dribble} alt="dribble icon" /></a>
                            <a className='hover:scale-[1.3]' href="#"><img className='opacity-70 hover:opacity-100 w-5 h-5' src={Icons.discord} alt="discord icon" /></a>
                        </div>
                    </div>
                </div>
                <p className="text-xs leading-[0.938rem] text-center copyright">
                    &copy;{new Date().getFullYear()}. {t('footer.first_segment_content')}<a href="https://github.com/victoire20">Yaba J</a>.{t('footer.second_segment_content')}<a href="https://www.figma.com/@elias_dev">Elias</a>.
                </p>
            </div>
        </footer>
    )
}