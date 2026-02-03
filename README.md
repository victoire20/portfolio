# Portfolio Personnel / Personal Portfolio

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)

---

## Navigation
- [French README:](./README-FR.md)

---

## Description (EN)
Welcome to my personal portfolio.
This site provides an overview of my professional journey, skills, and projects.
I am currently migrating the initial styling to Tailwind CSS and improving the overall design.

### Technologies Used
- Languages: HTML (initially), CSS (for some custom styles), TypeScript
- Frameworks: React + Vite, React Router, Tailwind CSS
- Planned: i18n (React Internationalization) for multi-language support (FR / EN)

### Current Work
- Migrating CSS to Tailwind CSS
- Handling remaining backgrounds
- Implementing multi-language support
- Cleaning and improving project architecture

---

## Features Implemented
- Multi-page portfolio with React Router (Home, About, Projects, Contact)
- Reusable layout components (Header, Footer, sections, cards)
- i18n setup with react-i18next and language JSON files (EN/FR)
- Language toggle in the header (EN/FR)
- Modular data structure for projects, skills, and fun facts

## Features Planned
- Light theme toggle
- Logo update
- Image animations
- Replace most legacy CSS with Tailwind CSS classes
- Admin backend for adding projects and managing media (e.g., Cloudinary)

## Documentation (FR)
- See the full French documentation in README-FR.md

---

# Portfolio Pages

Here are the main pages of my portfolio and their purpose:

| Pages | Description |
|------|-------------|
| Home | Provides a general overview of the portfolio with an introduction and quick access to other pages. |
| About | Get to know me better: my background, skills, and experience. |
| Projects | Discover my completed projects with descriptions, demonstrations, or screenshots. |
| Contact | Provides a way to contact me for questions, collaborations, or professional opportunities. |

---

## Deployment
The site will soon be available on Vercel for online access.
(Vercel link to be added once deployment is complete)

---

## Project Structure
```
src/
|-- assets/       # Images and media
|-- components/   # Reusable components
|   |-- card/
|   |   |-- ProjectCard.tsx
|   |   |-- ProjectGallery.tsx
|   |   `-- SkillBadge.tsx
|   |-- layout/
|   |   |-- Footer.tsx / Footer.css
|   |   `-- Header.tsx / Header.css
|   |-- sections/
|   |   |-- AboutSection.tsx
|   |   |-- ContactSection.tsx
|   |   |-- HeroSection.tsx / HeroSection.css
|   |   |-- MediaSection.tsx
|   |   |-- PageHeaderSection.tsx
|   |   |-- ProjectSection.tsx
|   |   |-- QuotationSection.tsx / QuotationSection.css
|   |   `-- SkillSection.tsx
|   `-- ui/
|       |-- button.tsx
|       |-- HeadSocial.tsx / HeadSocial.css
|       `-- LanguageDropdown.tsx / LanguageDropdown.css
|-- data/
|   |-- funfacts.ts
|   |-- projects.ts
|   `-- skills.ts
|-- hooks/
|   |-- useGallery.ts
|   `-- usePagination.ts
|-- i18n/
|   |-- en.json
|   |-- fr.json
|   `-- index.ts
|-- icons/
|   `-- index.ts
|-- pages/
|   |-- About.tsx
|   |-- Contact.tsx
|   |-- Home.tsx
|   `-- Projects.tsx
|-- tests/
|   `-- gallery.test.tsx
|-- types/
|   |-- funFact.ts
|   |-- project.ts
|   `-- skill.ts
|-- App.css
|-- App.tsx
|-- index.css
|-- main.tsx
`-- reset.css
```
