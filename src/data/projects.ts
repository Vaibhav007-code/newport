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
    title: "AI-Powered Task Manager",
    description: "A smart task management application that uses AI to prioritize and categorize tasks automatically.",
    image: "/images/projects/task-manager.jpg",
    tags: ["React", "TypeScript", "OpenAI", "TailwindCSS"],
    category: "personal",
    links: {
      github: "https://github.com/yourusername/task-manager",
      live: "https://task-manager-demo.com"
    }
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with real-time inventory management and payment processing.",
    image: "/images/projects/ecommerce.jpg",
    tags: ["Next.js", "MongoDB", "Stripe", "Redux"],
    category: "freelance",
    links: {
      github: "https://github.com/yourusername/ecommerce",
      live: "https://ecommerce-demo.com"
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
