import { Link } from 'react-router-dom'
import { ReactNode, AnchorHTMLAttributes } from 'react'



type ProjectsProps = {
    id: string
    className: string
    title?: string
    hasBar: boolean
    hasMoreBtn: boolean
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>


export default function ProjectSection({ id, className, title, hasBar, hasMoreBtn, children }: ProjectsProps) {
    return (
        <section className={className} id={id}>
            <div className="section__title">
                <div className="section__title__text">
                    <h2><span className="tag">#</span>{title}</h2>
                    {hasBar && <div className="section__bar"></div>}
                </div>
                {hasMoreBtn && <div className="section__btn__more">
                    <Link to="/projects"><span>View all</span>{" ~~>"}</Link>
                </div>}
            </div>
            <div className="grid">
                {children}
            </div>
        </section>
    )
}