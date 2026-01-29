import { Link, useLocation } from "react-router-dom"
import { Icons } from "../../icons"

import './LanguageDropdown.css'


type LanguageDropdownProps = {
    isOpen: boolean
    onOpenChange: (value: boolean) => void
}


export default function LanguageDropdown({ isOpen, onOpenChange }: LanguageDropdownProps) {
    const { pathname } = useLocation()

    return <div className="navbar__link language__selector">
        <div
            className="language__selected"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onClick={() => onOpenChange(!isOpen)}
        >
            EN
            <img
                className="language__icon"
                src={isOpen ? Icons.dropup : Icons.dropdown}
                alt=""
            />
        </div>

        <ul
            className={`language__selector__content ${isOpen ? 'open' : ''}`}
            role="listbox"
        >
            <li>
                <Link to={pathname === '/index' ? "/fr/" : `/fr${pathname}`}>FR</Link>
            </li>
        </ul>
    </div>
}