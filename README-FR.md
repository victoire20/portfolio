# Portfolio Personnel / Personal Portfolio

[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)

---

## 🌐 Navigation / Navigation
- [🇬🇧 Anglais](./README.md)

---

## Description (FR)
Bienvenue sur mon portfolio personnel !  
Ce site présente un **aperçu de mon parcours professionnel**, mes compétences et mes projets.  
Je suis actuellement en train de **migrer le style initial vers Tailwind CSS** et d’améliorer le design général.

### Technologies utilisées
- **Langages :** HTML (initialement), CSS (pour certains styles personnalisés), TypeScript  
- **Frameworks :** React + Vite, React Router, Tailwind CSS  
- **À venir :** i18n (React Internationalization) pour le support multi-langue (FR / EN)

### Travaux en cours
- Migration CSS → Tailwind CSS  
- Gestion des backgrounds restants  
- Mise en place du multi-langue  
- Nettoyage et amélioration possible de l’architecture du projet

---
# Pages du Portfolio

Voici les principales pages de mon portfolio et leur rôle :

| Pages | Description |
|------|-------------|
| **Accueil** | Présente un aperçu général du portfolio avec une introduction et un accès rapide aux autres pages. |
| **À propos** | Permet de mieux me connaître : parcours, compétences et expérience. |
| **Projets** | Découverte de mes projets réalisés avec descriptions, démonstrations ou captures d'écran. |
| **Contact** | Fournit un moyen de me contacter pour questions, collaborations ou opportunités professionnelles. |

---

### Fonctionnalités futures
- Backend d’administration pour l’ajout de projets et gestion du site (ex: hébergement d’images via Cloudinary)   

---

## 🚀 Déploiement
Le site sera bientôt disponible sur **Vercel** pour un accès en ligne.  
*(Lien Vercel à ajouter une fois le déploiement effectué)*

---

## 📂 Structure du projet
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
