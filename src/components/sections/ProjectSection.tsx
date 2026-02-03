import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ReactNode, AnchorHTMLAttributes } from 'react'



type ProjectsProps = {
    id: string
    className: string
    title?: string
    hasBar: boolean
    hasMoreBtn: boolean
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>


export default function ProjectSection({ id, className, title, hasBar, hasMoreBtn, children }: ProjectsProps) {
    const { t } = useTranslation()

    return (
        <section className={className} id={id}>
            <div className="section__title">
                <div className="section__title__text">
                    <h2><span className="tag">#</span>{title}</h2>
                    {hasBar && <div className="md:h-0.5 md:w-90  md:bg-(--purple-soft)"></div>}
                </div>
                {hasMoreBtn && <div className="section__btn__more">
                    <Link to="/projects"><span>{t('home.read_more')}</span>{" ~~>"}</Link>
                </div>}
            </div>
            <div className="grid">
                {children}
            </div>
        </section>
    )
}