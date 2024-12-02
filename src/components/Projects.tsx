import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi';
import { SiReact, SiTypescript, SiNodedotjs, SiTailwindcss, SiMongodb, SiPython } from 'react-icons/si';

interface Project {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
}

const projects: Project[] = [
  // Add your projects here
];

const getTechIcon = (tech: string) => {
  switch (tech.toLowerCase()) {
    case 'react':
      return <SiReact />;
    case 'typescript':
      return <SiTypescript />;
    case 'node.js':
      return <SiNodedotjs />;
    case 'tailwindcss':
      return <SiTailwindcss />;
    case 'mongodb':
      return <SiMongodb />;
    case 'python':
      return <SiPython />;
    default:
      return null;
  }
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="projects" className="section relative overflow-hidden">
      <div className="tech-grid opacity-10" />
      
      <div className="container">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="space-y-12"
        >
          <motion.h2 variants={itemVariants} className="section-title">
            Featured Projects
          </motion.h2>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                className="card group cursor-pointer hover:border-primary/50"
                onClick={() => setSelectedProject(project)}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative aspect-video mb-4 overflow-hidden rounded">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-textSecondary text-sm mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm text-primary/80 bg-primary/5 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 text-textSecondary">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiGithub size={20} />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiExternalLink size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl bg-surface p-6 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-textSecondary hover:text-primary transition-colors"
                onClick={() => setSelectedProject(null)}
              >
                <FiX size={24} />
              </button>

              <div className="relative aspect-video mb-6 overflow-hidden rounded-lg">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-bold mb-4">{selectedProject.title}</h3>
              
              <p className="text-textSecondary mb-6">
                {selectedProject.longDescription}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                {selectedProject.technologies.map((tech) => (
                  <div
                    key={tech}
                    className="flex items-center gap-1 text-primary/80 bg-primary/5 px-3 py-1 rounded"
                  >
                    {getTechIcon(tech)}
                    <span className="text-sm">{tech}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <FiGithub className="mr-2" />
                  View Source
                </a>
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  <FiExternalLink className="mr-2" />
                  Live Demo
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
