import type { Project } from "../types/project";

export const projects: Project[] = [
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