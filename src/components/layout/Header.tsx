import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Icons } from '../../icons'
import Button from '../ui/button'
import Logo from '/Logo.png'
import LanguageDropdown from '../ui/LanguageDropdown'
import { useTranslation } from 'react-i18next'

import './Header.css'


export default function Header() {
    const { pathname } = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)

    const { t } = useTranslation()


    useEffect(() => {
        if (isOpenMobileMenu) {
            const scrollY = window.scrollY
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
        } else {
            const scrollY = Math.abs(parseInt(document.body.style.top || '0'))
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            window.scrollTo(0, scrollY)
        }
    }, [isOpenMobileMenu])

    return (
        <header className="topbar">
            <NavLink to="/" className="flex flex-row items-center gap-2 text-[1rem] topbar__logo">
                <img className='w-4 h-4' src={Logo} alt="logo" />YJD Labs
            </NavLink>
            <nav className={isOpenMobileMenu ? "navbar open" : "navbar"}>
                <ul className="navbar__links">
                    <li className={`navbar__link t_link ${pathname === '/' ? 'active' : ''}`}>
                        <NavLink to="/" onClick={() => setIsOpenMobileMenu(false)}><span className="tag navbar_link_tag">#</span>{t('nav.home')}</NavLink>
                    </li>
                    <li className={`navbar__link t_link ${pathname === '/about' ? 'active' : ''}`}>
                        <NavLink to="/about" onClick={() => setIsOpenMobileMenu(false)}><span className="tag navbar_link_tag">#</span>{t('nav.about')}</NavLink>
                    </li>
                    <li className={`navbar__link t_link ${pathname === '/projects' ? 'active' : ''}`}>
                        {pathname === '/' ? (
                        <a href="#projects" className="navbar__link t_link">
                            <span className="tag navbar_link_tag">#</span>{t('nav.projects')}
                        </a>
                        ) : (
                        <NavLink to="/projects" onClick={() => setIsOpenMobileMenu(false)}><span className="tag navbar_link_tag">#</span>{t('nav.projects')}</NavLink>
                        )}
                    </li>
                    <li className={`navbar__link t_link ${pathname === '/contact' ? 'active' : ''}`}>
                        <NavLink to="/contact" onClick={() => setIsOpenMobileMenu(false)}><span className="tag navbar_link_tag">#</span>{t('nav.contact')}</NavLink>
                    </li>
                    <LanguageDropdown isOpen={isOpen}  onOpenChange={setIsOpen} />                    

                    <li className="navbar__social__media">
                        <a href="https://github.com/victoire20" target="_blank" className="social__media__icon">
                            <img src={Icons.github} alt="github icon" />
                        </a>
                    </li>
                </ul>
                {/* <h1>{t('Welcome to React')}</h1> */}
            </nav>
            <div className="sandwitch__btn">
                <Button url='#'>
                    <img 
                        src={isOpenMobileMenu ? Icons.close : Icons.sandwitch} 
                        alt="menu button" 
                        onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)} 
                    />
                </Button>
            </div>
        </header>
    )
}
