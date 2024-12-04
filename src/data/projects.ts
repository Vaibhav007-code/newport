import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: 'personal' | 'freelance';
  links: {
    github?: string;
    live?: string;
  };
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Group Study Site",
    description: "A collaborative platform for group study and learning.",
    image: "https://i.ibb.co/dWCQqLX/Screenshot-2024-12-03-224528.png",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    category: "personal",
    links: {
      github: "https://github.com/yourusername/group-study",
      live: "https://group-study-demo.com"
    }
  },
  {
    id: 2,
    title: "Note Taking App",
    description: "A comprehensive note-taking application with rich text editing features.",
    image: "https://i.ibb.co/N2g3zNz/Screenshot-2024-12-03-224406.png",
    tags: ["React", "TypeScript", "Node.js", "MongoDB"],
    category: "personal",
    links: {
      github: "https://github.com/yourusername/note-taking-app",
      live: "https://note-taking-demo.com"
    }
  },
  {
    id: 3,
    title: "Social Media Dashboard",
    description: "A comprehensive dashboard for managing multiple social media accounts with analytics.",
    image: "/images/projects/social-dashboard.jpg",
    tags: ["Vue.js", "Firebase", "Chart.js", "TailwindCSS"],
    category: "personal",
    links: {
      github: "https://github.com/yourusername/social-dashboard",
      live: "https://social-dashboard-demo.com"
    }
  }
];

export const socialLinks = [
  {
    id: 1,
    name: "GitHub",
    url: "https://github.com/Vaibhav007-code",
    icon: FaGithub
  },
  {
    id: 2,
    name: "Portfolio",
    url: "https://your-portfolio.com",
    icon: FaExternalLinkAlt
  }
];
