import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'


type AboutProps = {
    id?: string
    hasBar?: boolean
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>


export default function AboutSection({ id, hasBar, children }: AboutProps) {
    const { t } = useTranslation()

    return (
        <section className="row" id={id}>
            <div className="section__title">
                <div className="section__title__text">
                    <h2><span className="tag">#</span>{t('home.about_title')}</h2>
                    {hasBar && <div className="section__bar"></div>}
                </div>
            </div>
            <div className="section__body">
                {children}
            </div>
        </section>
    )
}