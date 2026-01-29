import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Icons } from '../../icons'
import Button from '../ui/button'
import Logo from '/Logo.png'
import LanguageDropdown from '../ui/LanguageDropdown'

import './Header.css'

// import { useTranslation } from 'react-i18next'
// import i18n from '../../i18n/index'
// import { withNamespaces } from 'react-i18next'


export default function Header() {
    const { pathname } = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)

    // const { t, i18n } = useTranslation()


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
            <NavLink to="/" className="logo topbar__logo"><img src={Logo} alt="logo" />Elias</NavLink>
            <nav className={isOpenMobileMenu ? "navbar open" : "navbar"}>
                <ul className="navbar__links">
                    <li className={`navbar__link t_link ${pathname === '/index' ? 'active' : ''}`}>
                        <NavLink to="/" onClick={() => setIsOpenMobileMenu(false)}><span className="tag navbar_link_tag">#</span>home</NavLink>
                    </li>
                    <li className={`navbar__link t_link ${pathname === '/about' ? 'active' : ''}`}>
                        <NavLink to="/about" onClick={() => setIsOpenMobileMenu(false)}><span className="tag navbar_link_tag">#</span>about</NavLink>
                    </li>
                    <li className={`navbar__link t_link ${pathname === '/projects' ? 'active' : ''}`}>
                        {pathname === '/' ? (
                        <a href="#projects" className="navbar__link t_link">
                            <span className="tag navbar_link_tag">#</span>projects
                        </a>
                        ) : (
                        <NavLink to="/projects" onClick={() => setIsOpenMobileMenu(false)}><span className="tag navbar_link_tag">#</span>projects</NavLink>
                        )}
                    </li>
                    <li className={`navbar__link t_link ${pathname === '/contact' ? 'active' : ''}`}>
                        <NavLink to="/contact" onClick={() => setIsOpenMobileMenu(false)}><span className="tag navbar_link_tag">#</span>contact</NavLink>
                    </li>
                    <LanguageDropdown isOpen={isOpen}  onOpenChange={setIsOpen} />                    

                    <li className="navbar__social__media">
                        <a href="https://github.com/victoire20" target="_blank" className="social__media__icon">
                            <img src={Icons.github} alt="github icon" />
                        </a>
                        <a href="#" className="social__media__icon">
                            <img src={Icons.dribble} alt="dribble icon" />
                        </a>
                        <a href="#" className="social__media__icon">
                            <img src={Icons.figmat} alt="figmat icon" />
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

// export default withNamespaces()(Header);
