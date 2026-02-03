import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'


type AboutProps = {
    id?: string
    hasBar?: boolean
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>


export default function AboutSection({ hasBar, children }: AboutProps) {
    const { t } = useTranslation()

    return (
        <section className="row">
            <div className="section__title">
                <div className="section__title__text">
                    <h2><span className="tag">#</span>{t('home.about_title')}</h2>
                    {hasBar && <div className="md:h-0.5 md:w-60  md:bg-(--purple-soft)"></div>}
                </div>
            </div>
            <div className="section__body">
                {children}
            </div>
        </section>
    )
}