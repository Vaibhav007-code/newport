import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  liveLink: string;
  image: string;
}

const projects: Project[] = [
  {
    title: "Group Study Platform",
    description: "A collaborative learning platform that enables students to create and join study groups, share resources, and learn together in real-time. Features include live chat, resource sharing, and collaborative study tools.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Express", "Tailwind CSS"],
    liveLink: "https://crap-for-you.onrender.com",
    image: "/group-study.png"
  },
  {
    title: "Note Taking Application",
    description: "A feature-rich note-taking application with a clean, intuitive interface. Users can create, organize, and manage notes with rich text editing, tags, and categories. Built with modern web technologies for optimal performance.",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Express", "Tailwind CSS"],
    liveLink: "https://journal-dabria.vercel.app",
    image: "/note-app.png"
  }
];

const Projects: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="projects"
      className="py-20 bg-[#191919] min-h-screen flex items-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-16 text-center"
        >
          Featured Projects
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#2a2a2a] rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 shadow-xl"
            >
              <div className="relative aspect-video overflow-hidden group">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#2eaadc] text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-[#2596c4] transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Visit Site</span>
                    <FiExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">{project.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-[#333333] text-[#2eaadc] px-4 py-1.5 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#2eaadc] hover:text-[#2596c4] transition-colors duration-300 group"
                >
                  <span className="font-medium">View Project</span>
                  <FiExternalLink className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Projects;
