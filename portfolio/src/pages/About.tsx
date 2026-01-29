import FunFactImg from '../assets/my fun facts.png'
import ImgAbout from '../assets/about-1.png'

import AboutSection from '../components/sections/AboutSection'
import PageHeaderSection from '../components/sections/PageHeaderSection'

export default function About() {
    return <>
        <main>
            <PageHeaderSection title='about-me' content='Who am it?' />
            <AboutSection>
                <div className="section__body__content">
                    <div className="text__content">
                        <p>
                            Hello, my name is Yaba Jean de DIEU, a full-stack developer with over 3 years of experience. 
                            I started in back-end development, where I learned to build solid and high-performance systems, 
                            before expanding my skills to full-stack development to create complete and reliable web applications.
                        </p>
                        <p>
                            I design robust, secure, and user-focused solutions, with a strong emphasis on architecture, maintainability, and code quality. 
                            Curious and meticulous, I stay up to date with modern technologies to deliver scalable, efficient, and user-oriented projects. 
                            Passionate about innovation and problem-solving, 
                            I prioritize collaboration and creativity to transform ideas into tangible and functional applications.
                        </p>
                    </div>
                </div>
                <div className="section__image">
                    <img src={ImgAbout} alt="section image" />
                </div>
            </AboutSection>

            <section className="row">
                <div className="section__title">
                    <div className="section__title__text">
                        <h2><span className="tag">#</span>skills</h2>
                    </div>
                </div>
                <div className="section__body">
                    <div className="line__div">
                        <div className="skill__item">
                            <div className="skills__designation">Languages</div>
                            <div className="skills__list">
                                <span>Python</span> <span>PhP</span> <span>SQL</span> <span>JavaScript</span>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skills__designation">Other</div>
                            <div className="skills__list">
                                <span>HTML</span> <span>CSS</span> <span>Jquery</span> <span>REST</span> <span>Jinja</span> <span>JWT</span>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skills__designation">Tools</div>
                            <div className="skills__list">
                                <span>VSCode</span> <span>Linux</span> <span>Figma</span> <span>IntelliJ</span> <span>IDEA</span> 
                                <span>Git</span> <span>Github Action</span> <span>Docker</span> <span>Postman</span> <span>CPanel</span> 
                                <span>SMTP</span> <span>Swagger</span> <span>Swagger UI</span> <span>OpenAPI</span>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skills__designation">Databases</div>
                            <div className="skills__list">
                                <span>SQLite</span> <span>PostgresSQL</span> <span>MySQL</span>
                            </div>
                        </div>
                        <div className="skill__item">
                            <div className="skills__designation">Frameworks</div>
                            <div className="skills__list">
                                <span>React</span> <span>Django</span> <span>FastAPI</span> <span>Laravel</span> <span>Bootstrap</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="last_row">
                <div className="section__title">
                    <div className="section__title__text">
                        <h2><span className="tag">#</span>my-fun-facts</h2>
                        <div className="section__bar"></div>
                    </div>
                </div>
                <div className="section__body section__fact">
                    <div className="line__div fun__fact">
                        <div className="fact__item">I’m hopeless at designing mockups from scratch</div>
                        <div className="fact__item">I do full-stack development but I prefer back-end work</div>
                        <div className="fact__item">AI fascinates me, though I sometimes miss the human touch</div>
                        <div className="fact__item">I love dogs, even though I don’t have one</div>
                        <div className="fact__item">I treasure moments with family and friends</div>
                    </div>
                    <div className="section__image hide__image">
                        <img src={FunFactImg} alt="section image" />
                    </div>
                </div>
            </section>
        </main>
    </>
}
