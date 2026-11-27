import type { Project } from "../types/project";

export const projects: Project[] = [
    {
        id: 1,
        title: "Xora Saas landing Page",
        description: "Project completed during training on the Tailwind CSS framework",
        skills: ["HTML", "CSS", "React JS", "Tailwind CSS", "Vercel"],
        cover: "/images/projects/xora-saas-landing-page.jpg",
        isPrivate: false,
        liveUrl: "https://xora-saas-landing-page-hjwt06kpm.vercel.app",
        githubUrl: "https://github.com/victoire20/xora-saas-landing-page",
        maquette: {
            support: null,
            url: null
        },
        isSmallProject: false
    },
    {
        id: 2,
        title: "Browser extension manager ui",
        description: "This is a challenge completed on frontendmentor.io",
        skills: ["HTML", "CSS", "React JS", "Tailwind CSS", "Netlify"],
        cover: "/images/projects/browser-extension-manager-ui.jpg",
        isPrivate: false,
        liveUrl: "https://dapper-smakager-f5b8f0.netlify.app",
        githubUrl: "https://github.com/victoire20/browser-extension-manager-ui",
        maquette: {
            support: null,
            url: null
        },
        isSmallProject: false
    },
    {
        id: 3,
        title: "Calculator App",
        description: "This is a challenge completed on frontendmentor.io",
        skills: ["Vite", "React", "CSS", "TypeScript", "Tailwind CSS"],
        cover: "/images/projects/calculator-app.jpg",
        isPrivate: false,
        liveUrl: "https://calculator-app-alpha-ashy.vercel.app",
        githubUrl: "https://github.com/victoire20/calculator-app",
        maquette: {
            support: null,
            url: null
        },
        isSmallProject: false
    },
    {
        id: 4,
        title: "Portfolio",
        description: "You’re using it rn",
        skills: ["React", "CSS", "TypeScript"],
        cover: "/images/projects/portfolio.jpg",
        isPrivate: false,
        liveUrl: "https://portfolio-eight-dun-30.vercel.app",
        githubUrl: "https://github.com/victoire20/portfolio",
        maquette: {
            support: null,
            url: null
        },
        isSmallProject: false
    },
    {
        id: 6,
        title: "Task Tracker CLI",
        description: "A simple command-line interface application to manage and track tasks, built with Python. It allows users to create, view, update, and delete tasks efficiently.",
        skills: ["python"],
        isPrivate: true,
        // liveUrl: "https://example.com",
        githubUrl: "https://github.com/victoire20/task-tracker-cli",
        // gallery: [
        //     "/images/projects/x/1.jpg",
        //     "/images/projects/x/2.jpg"
        // ],
        maquette: {
            support: null,
            url: null
        },
        isSmallProject: true
    },
]