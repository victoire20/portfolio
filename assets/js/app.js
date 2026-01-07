import ToggleController from "./controllers/ToggleController.js";
import YearController from "./controllers/YearController.js";


const languageMenu = new ToggleController()

const content = document.querySelector('.language__selector__content')
const dropdown = document.querySelector('#dropdown')
const dropup = document.querySelector('#dropup')

languageMenu.subscribe(isOpen => {
    content.classList.toggle('open', isOpen)
    dropdown.style.display = isOpen ? 'none' : 'inline-block'
    dropup.style.display = isOpen ? 'inline-block' : 'none'
})

document
    .querySelector('#language__selected')
    .addEventListener('click', () => languageMenu.toggle())

document.body.addEventListener('click', e => {
    if (!e.target.closest('#language__selected')) {
        languageMenu.close()
    }
})


const mobileMenu = new ToggleController()

const navbar = document.querySelector('.navbar')
const openBtn = document.querySelector('#open__menu')
const closeBtn = document.querySelector('#close__menu')

mobileMenu.subscribe(isOpen => {
    navbar.classList.toggle('open', isOpen)
    openBtn.style.display = isOpen ? 'none' : 'block'
    closeBtn.style.display = isOpen ? 'block' : 'none'
    document.body.classList.toggle('no-scroll', isOpen)
})

openBtn.addEventListener('click', () => mobileMenu.open())
closeBtn.addEventListener('click', () => mobileMenu.close())


const yearController = new YearController()

const yearElement = document.querySelector('.year')

if (yearElement) {
    yearElement.textContent = yearController.getCurrentYear()
}