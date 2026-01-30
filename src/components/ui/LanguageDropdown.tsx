import { Link } from "react-router-dom"
import { Icons } from "../../icons"

import './LanguageDropdown.css'


type LanguageDropdownProps = {
    isOpen: boolean
    pathname: string
    onOpenChange: (value: boolean) => void
}


export default function LanguageDropdown({ isOpen, pathname, onOpenChange }: LanguageDropdownProps) {

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
                {/* <Link to={pathname === '/index' ? "/fr/" : `/fr${pathname}`}>FR</Link> */}
                <Link to="#">FR</Link>
            </li>
        </ul>
    </div>
}