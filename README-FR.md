# Portfolio Personnel / Personal Portfolio

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)

---

## Navigation
- English README: ./README.md

---

## Description (FR)
Bienvenue sur mon portfolio personnel.
Ce site presente un apercu de mon parcours professionnel, mes competences et mes projets.
Je suis en train de migrer le style initial vers Tailwind CSS et d'ameliorer le design general.

### Technologies utilisees
- Langages : HTML (initialement), CSS (pour certains styles personnalises), TypeScript
- Frameworks : React + Vite, React Router, Tailwind CSS
- Prevus : i18n (React Internationalization) pour le support multi-langue (FR / EN)

### Travaux en cours
- Migration CSS vers Tailwind CSS
- Gestion des backgrounds restants
- Mise en place du multi-langue
- Nettoyage et amelioration de l'architecture du projet

---

## Fonctionnalites realisees
- Portfolio multi-pages avec React Router (Accueil, A propos, Projets, Contact)
- Composants reutilisables (Header, Footer, sections, cartes)
- i18n configure avec react-i18next et fichiers de langue (EN/FR)
- Toggle de langue dans le header (EN/FR)
- Donnees modulees pour projets, competences et fun facts

## Fonctionnalites prevues
- Toggle de theme clair
- Mise a jour du logo
- Animations sur les images
- Remplacer la plupart du CSS traditionnel par des classes Tailwind CSS
- Backend d'administration pour l'ajout de projets et la gestion des medias (ex : Cloudinary)

## Documentation (EN)
- Voir la documentation en anglais dans README.md

---

# Pages du Portfolio

Voici les principales pages de mon portfolio et leur role :

| Pages | Description |
|------|-------------|
| Accueil | Presente un apercu general du portfolio avec une introduction et un acces rapide aux autres pages. |
| A propos | Permet de mieux me connaitre : parcours, competences et experience. |
| Projets | Decouverte de mes projets realises avec descriptions, demonstrations ou captures d'ecran. |
| Contact | Fournit un moyen de me contacter pour questions, collaborations ou opportunites professionnelles. |

---

## Deploiement
Le site sera bientot disponible sur Vercel pour un acces en ligne.
(Lien Vercel a ajouter une fois le deploiement effectue)

---

## Structure du projet
```
src/
|-- assets/       # Images et medias
|-- components/   # Composants reutilisables
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
