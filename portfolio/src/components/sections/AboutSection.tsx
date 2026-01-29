import { AnchorHTMLAttributes, ReactNode } from 'react'


type AboutProps = {
    id?: string
    hasBar?: boolean
    children: ReactNode
} & AnchorHTMLAttributes<HTMLAnchorElement>


export default function AboutSection({ id, hasBar, children }: AboutProps) {
    return (
        <section className="row" id={id}>
            <div className="section__title">
                <div className="section__title__text">
                    <h2><span className="tag">#</span>about-me</h2>
                    {hasBar && <div className="section__bar"></div>}
                </div>
            </div>
            <div className="section__body">
                {children}
            </div>
        </section>
    )
}