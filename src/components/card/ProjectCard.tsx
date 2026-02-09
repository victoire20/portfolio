import Button from "../ui/button"


const ImageCard = ({ data }) => (
    data.liveUrl ? (<a href={data.liveUrl}><img src={data.cover} alt={data.title} /></a>) : (<img src={data.cover} alt={data.title} />)
)


const ProjectCard = ({ data }) => {
    return (<div className="card grid__items">
        {!data.isSmallProject && <ImageCard data={data} />} 
        <h3 className="card__title">
            {data.skills.map((skill, index) => <span key={index}>{skill}</span> )}
        </h3>
        <div className="card__body">       
            {<h2 className="card__body__title"><a href="#">{data.title}</a></h2>}                     
            <p className="card__body__content">{data.description}</p>
        </div>
        <div className="card__footer">
            <div className="flex flex-row items-start gap-[0.438rem]">
                {data.liveUrl ? (
                    <Button target="_blank" className='btn' url={`${data.liveUrl}`}>{"Live <~>"}</Button>
                ) : (
                    <Button target="_blank" className='btn disabled' url=''>{"Live <~>"}</Button>
                )}
                {data.githubUrl ? (
                    <Button target="_blank" className='btn' url={`${data.githubUrl}`}>{"Github <~>"}</Button>
                ) : (
                    <Button target="_blank" className='btn disabled' url=''>{"Github <~>"}</Button>
                )}
                {data.maquette.url && <Button target="_blank" className='btn' url={`${data.maquette.url}`}>{`${data.maquette.support} <~`}</Button>}
            </div>
        </div>
    </div>)
}

export default ProjectCard