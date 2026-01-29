type PageHeaderProps = {
    title: string
    content?: string
}

export default function PageHeaderSection({ title, content }: PageHeaderProps) {
    return <section className="row hero">
                <div className="page__tile">
                    <h1><span className="tag">/</span>{title}</h1>
                    <p>{content}</p>
                </div>
            </section>
}