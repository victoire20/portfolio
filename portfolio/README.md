# Portfolio Personnel / Personal Portfolio

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)

---

## 🌐 Navigation / Navigation
- [🇫🇷 Frensh](#portfolio-personnel--personal-portfolio)

---

## Description (EN)
Welcome to my personal portfolio!  
This site provides an **overview of my professional journey**, skills, and projects.  
I am currently **migrating the initial styling to Tailwind CSS** and improving the overall design.

### Technologies Used
- **Languages:** HTML (initially), CSS (for some custom styles), TypeScript  
- **Frameworks:** React + Vite, React Router, Tailwind CSS  
- **Planned:** i18n (React Internationalization) for multi-language support (FR / EN)

### Current Work
- Migrating CSS → Tailwind CSS  
- Handling remaining backgrounds  
- Implementing multi-language support  
- Cleaning and improving project architecture

---
# Pages du Portfolio

Here are the main pages of my portfolio and their purpose:

| Pages | Description |
|------|-------------|
| **Home** | Provides a general overview of the portfolio with an introduction and quick access to other pages. |
| **About** | Get to know me better: my background, skills, and experience. |
| **Projects** | Discover my completed projects with descriptions, demonstrations, or screenshots. |
| **Contact** | Provides a way to contact me for questions, collaborations, or professional opportunities. |

---

### Future Features
- Admin backend for adding projects and managing the site (e.g., images via Cloudinary)  

---

## 🚀 Deployment
The site will soon be available on **Vercel** for online access.  
*(Vercel link to be added once deployment is complete)*  

---

## 📂 Project Structure
```
src/
├─ assets/ # Images et médias
├─ components/ # Composants réutilisables
│  ├─ card/
│  │  ├─ ProjectCard.tsx
│  │  ├─ ProjectGallery.tsx
│  │  └─ SkillBadge.tsx
│  ├─ layout/
│  │  ├─ Footer.tsx / Footer.css
│  │  └─ Header.tsx / Header.css
│  ├─ sections/
│  │  ├─ AboutSection.tsx
│  │  ├─ ContactSection.tsx
│  │  ├─ HeroSection.tsx / HeroSection.css
│  │  ├─ MediaSection.tsx
│  │  ├─ PageHeaderSection.tsx
│  │  ├─ ProjectSection.tsx
│  │  ├─ QuotationSection.tsx / QuotationSection.css
│  │  └─ SkillSection.tsx
│  └─ ui/
│     ├─ button.tsx
│     ├─ HeadSocial.tsx / HeadSocial.css
│     └─ LanguageDropdown.tsx / LanguageDropdown.css
├─ data/
│  ├─ funfacts.ts
│  ├─ projects.ts
│  └─ skills.ts
├─ hooks/
│  ├─ useGallery.ts
│  └─ usePagination.ts
├─ i18n/
│  ├─ en.json
│  ├─ fr.json
│  └─ index.ts
├─ icons/
│  └─ index.ts
├─ pages/
│  ├─ About.tsx
│  ├─ Contact.tsx
│  ├─ Home.tsx
│  └─ Projects.tsx
├─ tests/
│  └─ gallery.test.tsx
├─ types/
│  ├─ funFact.ts
│  ├─ project.ts
│  └─ skill.ts
├─ App.css
├─ App.tsx
├─ index.css
├─ main.tsx
└─ reset.css
```
