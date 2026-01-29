import p1 from '../assets/images/projects/chertnodes.jpg'
import p2 from '../assets/images/projects/kahoot.png'
import p3 from '../assets/images/projects/projectx.png'
import p4 from '../assets/images/projects/kotik.png'
import p5 from '../assets/images/projects/portfolio.png'
import ProjectSection from '../components/sections/ProjectSection'
import PageHeaderSection from '../components/sections/PageHeaderSection'


export default function Projects() {
    return <>
        <main>
            <PageHeaderSection title='projects' content='List of my projects' />

            <ProjectSection id='projects' className='row' title='complete-apps' hasBar={false} hasMoreBtn={false}>                
                <div className="card grid__items">
                    <a href="#">
                        <img src={p1} alt="Project 1" />
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
                            <a href="#" className="btn">{'Live <~>'}</a>
                            <a href="#" className="btn disabled">{'Cached >='}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <a href="#">
                        <img src={p2} alt="Project 2" />
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
                            <a href="#" className="btn">{'Live <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <a href="#">
                        <img src={p3} alt="Project 3" />
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
                            <a href="#" className="btn">{'Live <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <a href="#">
                        <img src={p4} alt="Project 4" />
                    </a>
                    <h3 className="card__title">
                        <span>HTML</span> 
                        <span>CSS</span> 
                        <span>JS</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">Kotik Bot</a></h2>                     
                        <p className="card__body__content">
                            Multi-functional discord bot 
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Live <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <a href="#">
                        <img src={p5} alt="Project 5" />
                    </a>
                    <h3 className="card__title">
                        <span>Vue</span> 
                        <span>TS</span> 
                        <span>Less</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">Portfolio</a></h2>                     
                        <p className="card__body__content">
                            You’re using it rn
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Github <~>'}</a>
                        </div>
                    </div>
                </div>
            </ProjectSection>

            <ProjectSection className="last_row skill" id="skill" title='small-projects' hasBar={false} hasMoreBtn={false}>
                <div className="card grid__items">
                    <h3 className="card__title">
                        <span>Discord.js</span> <span>TS</span> <span>JS</span>
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title">
                            <a href="#">Bot boilerplate</a>
                        </h2>                     
                        <p className="card__body__content">
                            Start creating scalable discord.js bot with typescript in seconds
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Github <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <h3 className="card__title">
                        <span>Vue</span> 
                        <span>CSS</span> 
                        <span>JS</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">My blog</a></h2>                     
                        <p className="card__body__content">
                            Front-end of my future blog website written in vue
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Github <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <h3 className="card__title">
                        <span>Figma</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">Chess pro</a></h2>                     
                        <p className="card__body__content">
                            Figma landing page about service for viewing chess tournaments 
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Figma <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <h3 className="card__title">
                        <span>Figma</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">Crash protect website</a></h2>                     
                        <p className="card__body__content">
                            Figma template for website about anti-raid, anti-crash discord bot
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Figma <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <h3 className="card__title">
                        <span>HTML</span> 
                        <span>CSS</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">CSS expirements</a></h2>                     
                        <p className="card__body__content">
                            Collection of my different little projects in css
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Live <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <h3 className="card__title">
                        <span>Lua</span> 
                        <span>NeoVim</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">Web Dev nvim config</a></h2>                     
                        <p className="card__body__content">
                            Config for neovim perfect for web developer
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Github <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <h3 className="card__title">
                        <span>Python</span> 
                        <span>Quart</span> 
                        <span>HTML</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">Ooku</a></h2>                     
                        <p className="card__body__content">
                            Simple link shortener with auth
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Live <~>'}</a>
                        </div>
                    </div>
                </div>
                <div className="card grid__items">
                    <h3 className="card__title">
                        <span>Figma</span> 
                    </h3>
                    <div className="card__body">       
                        <h2 className="card__body__title"><a href="#">School website</a></h2>                     
                        <p className="card__body__content">
                            Figma template website for my school
                        </p>
                    </div>
                    <div className="card__footer">
                        <div className="btn__group">
                            <a href="#" className="btn">{'Figma <~>'}</a>
                        </div>
                    </div>
                </div>
            </ProjectSection>
        </main>
    </>
}