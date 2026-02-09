import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'


type AboutProps = {
    id?: string
    hasTitle?: boolean
    hasBar?: boolean
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>


export default function AboutSection({ hasTitle=true, hasBar, children }: AboutProps) {
    const { t } = useTranslation()

    return (
        <section className="row">
            <div className="section__title">
                <div className="section__title__text">
                    {hasTitle && <h2><span className="tag">#</span>{t('home.about_title')}</h2>}
                    {hasBar && <div className="md:h-0.5 md:w-60  md:bg-(--purple-soft)"></div>}
                </div>
            </div>
            {children}
        </section>
    )
}