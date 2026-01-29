import HeroImg from '../../assets/hero-image-1.png'
import Button from '../ui/button'

import './HeroSection.css'

export default function HeroSection() {
    return (
        <section className="row hero" id="hero">
            <div className="hero__content">
                <h1 className="hero__title">
                    I am a <span className="hero__stack"><span className="text__nowrap">full-stack</span> developer</span> focused on <span className="hero__stack">web</span> applications and <span className="hero__stack">APIs</span>
                </h1>
                <p className="hero__description">
                    I build performant, secure, and scalable web solutions from front-end to back-end
                </p>
                <div className="btn__group">                    
                    <Button className='btn' url='/contact'>Contact me!!</Button>
                    <Button className='btn' url='#' download>Resume me!!</Button>
                </div>
            </div>
            <div className="hero__image">
                <img src={HeroImg} alt="Hero Image" />
                <div className="hero__website__status">
                    <div className="hero__website__status__dot"></div> 
                    <div>Currently available for <span className="website__designation">new projects</span></div>
                </div>
            </div>
        </section>
    )
}