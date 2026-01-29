import { Icons } from "../../icons"

import './HeadSocial.css'

export default function HeadSocial() {
    return <div className="head__social">
        <div className="head__media__bar"></div>
        <div className="head__media__icon">
            <a href="https://github.com/victoire20" target="_blank"><img src={Icons.github} alt="github icon" /></a>
            <a href="#"><img src={Icons.dribble} alt="dribble icon" /></a>
            <a href="#"><img src={Icons.figmat} alt="figma icon" /></a>
        </div>
    </div>
}