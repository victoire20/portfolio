import AboutSection from "../components/sections/AboutSection"
import ContactSection from "../components/sections/ContactSection"
import HeroSection from "../components/sections/HeroSection"
import ProjectSection from "../components/sections/ProjectSection"
import QuotationSection from "../components/sections/QuotationSection"
import SkillSection from "../components/sections/SkillSection"

import Button from "../components/ui/button"


import Project1 from '../assets/images/projects/chertnodes.jpg'
import Project2 from '../assets/images/projects/projectx.png'
import Project3 from '../assets/images/projects/kahoot.png'

import ImgAbout from '../assets/about-1.png'


export default function Home() {
    return <>
            <main>
                <HeroSection />
                <QuotationSection />
                <ProjectSection id="projects" className="row medium-square-right" title="projects" hasBar={true} hasMoreBtn={true}>
                    <div className="card grid__items">
                        <a href="#">
                            <img src={Project1} alt="Project 1" />
                        </a>
                        <h3 className="card__title">
                            <span>HTML</span> <span>SCSS</span> <span>Python</span> <span>Flask</span>
                        </h3>
                        <div className="card__body">       
                            <h2 className="card__body__title">
                                <a href="#">ChertNodes</a>
                            </h2>                     
                            <p className="card__body__content">
                                Minecraft servers hosting 
                            </p>
                        </div>
                        <div className="card__footer">
                            <div className="btn__group">
                                <Button className='btn' url='#'>{"Live <~>"}</Button>
                                <Button className='btn disabled' url='#'>{"Cached >="}</Button>
                            </div>
                        </div>
                    </div>
                    <div className="card grid__items">
                        <a href="#">
                            <img src={Project2} alt="Project 2" />
                        </a>
                        <h3 className="card__title">
                            <span>React</span> 
                            <span>Express</span> 
                            <span>Discord.js</span> 
                            <span>Node.js</span> 
                            <span>HTML</span> 
                            <span>SCSS</span> 
                            <span>Python</span> 
                            <span>Flask</span>
                        </h3>
                        <div className="card__body">       
                            <h2 className="card__body__title"><a href="#">ProjectX</a></h2>                     
                            <p className="card__body__content">
                                Discord anti-crash bot 
                            </p>
                        </div>
                        <div className="card__footer">
                            <div className="btn__group">
                                <a href="#" className="btn">{"Live <~>"}</a>
                            </div>
                        </div>
                    </div>
                    <div className="card grid__items">
                        <a href="#">
                            <img src={Project3} alt="Project 3" />
                        </a>
                        <h3 className="card__title">
                            <span>CSS</span> 
                            <span>Express</span> 
                            <span>Node.js</span> 
                        </h3>
                        <div className="card__body">       
                            <h2 className="card__body__title"><a href="#">Kahoot Answers Viewer</a></h2>                     
                            <p className="card__body__content">
                                Get answers to your kahoot quiz
                            </p>
                        </div>
                        <div className="card__footer">
                            <div className="btn__group">
                                <a href="#" className="btn">{"Live <~>"}</a>
                            </div>
                        </div>
                    </div>
                </ProjectSection>
                <SkillSection />
                <AboutSection id="about">
                    <div className="section__body__content">
                        <div className="text__content">
                            <p>Hello, i’m Jean de DIEU Yaba!</p>
                            <p>
                                I’m a full-stack developer with over 3 years of experience, having started my career in back-end 
                                development before evolving into building complete, well-structured web solutions.
                            </p>
                            <p>
                                I design performant, secure, and user-focused web applications, with strong attention to architecture, maintainability, and code quality.
                                Driven by continuous improvement, I keep learning and adapting to modern technologies to deliver reliable and scalable systems.
                            </p>
                        </div>
                        <Button url='/about' className='btn btn__about'>{"Read more ->"}</Button>
                    </div>
                    <div className="section__image">
                        <img src={ImgAbout} alt="section image" />
                    </div>                    
                </AboutSection>
                <ContactSection />
            </main>
        </>    
}
