import { Icons } from "../../icons"
import { useTranslation } from "react-i18next"

import './LanguageDropdown.css'
import { useEffect } from "react"


type LanguageDropdownProps = {
    isOpen: boolean
    onOpenChange: (value: boolean) => void
}


export default function LanguageDropdown({ isOpen, onOpenChange }: LanguageDropdownProps) {
    const { i18n } = useTranslation()
    let currentLang = i18n.language?.toLowerCase().startsWith('fr') ? 'FR' : 'EN'

    const handleChange = (lang: 'en' | 'fr') => {
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang)
            localStorage.setItem('lang', lang)
        }
        onOpenChange(false)
    }

    useEffect(() => {
        const storedLang = localStorage.getItem('lang')
        if (storedLang && storedLang !== i18n.language) {
            i18n.changeLanguage(storedLang)
        }
    }, [i18n.language])

    return <div className="navbar__link language__selector">
        <div
            className="language__selected"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            onClick={() => onOpenChange(!isOpen)}
        >
            {currentLang}
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
                {currentLang !== 'EN' ? (
                    <button
                        type="button"
                        role="option"
                        aria-selected={true}
                        onClick={() => handleChange('en')}
                    >
                        EN
                    </button>
                ) : (
                   <button
                        type="button"
                        role="option"
                        aria-selected={true}
                        onClick={() => handleChange('fr')}
                    >
                        FR
                    </button> 
                )}
            </li>
        </ul>
    </div>
}
