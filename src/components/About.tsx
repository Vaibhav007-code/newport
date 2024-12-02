import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiBriefcase, FiLayers, FiArrowUpRight } from 'react-icons/fi';

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <section id="about" className="py-20 bg-[#191919]">
      <div className="container mx-auto px-6">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-16"
        >
          {/* Main About */}
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white font-inter mb-6 tracking-tight">
              About Me
            </h2>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-inter">
              I'm a passionate Full Stack Developer who transforms ideas into elegant digital solutions. 
              With expertise in both frontend and backend technologies, I create seamless, user-centric applications 
              that make a difference.
            </p>
          </motion.div>

          {/* Skills Section */}
          <motion.div {...fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#333333] group hover:border-[#2eaadc] transition-colors duration-300">
              <FiCode className="text-[#2eaadc] w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white font-inter mb-3">Technical Skills</h3>
              <p className="text-gray-300 leading-relaxed">
                Proficient in React, TypeScript, Node.js, and modern web technologies. 
                Experienced in building responsive, scalable applications.
              </p>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#333333] group hover:border-[#2eaadc] transition-colors duration-300">
              <FiBriefcase className="text-[#2eaadc] w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white font-inter mb-3">Freelance Work</h3>
              <p className="text-gray-300 leading-relaxed">
                Collaborated with various businesses to deliver custom solutions. 
                Specialized in e-commerce and business automation projects.
              </p>
            </div>

            <div className="bg-[#2a2a2a] p-6 rounded-lg border border-[#333333] group hover:border-[#2eaadc] transition-colors duration-300">
              <FiLayers className="text-[#2eaadc] w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white font-inter mb-3">Projects</h3>
              <p className="text-gray-300 leading-relaxed">
                Created innovative solutions including a group study platform 
                and a feature-rich note-taking application.
              </p>
            </div>
          </motion.div>

          {/* Featured Work */}
          <motion.div {...fadeInUp} className="space-y-8">
            <h3 className="text-2xl font-bold text-white font-inter text-center mb-8">
              Featured Work
            </h3>
            
            {/* Freelance Section */}
            <div className="bg-[#2a2a2a] p-8 rounded-lg border border-[#333333]">
              <h4 className="text-xl font-bold text-[#2eaadc] font-inter mb-4">
                Freelance Projects
              </h4>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-[#2eaadc] mr-2">•</span>
                  <span>Developed custom e-commerce solutions for small businesses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2eaadc] mr-2">•</span>
                  <span>Created automated workflow systems for business optimization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#2eaadc] mr-2">•</span>
                  <span>Implemented responsive web designs for various clients</span>
                </li>
              </ul>
            </div>

            {/* Personal Projects Section */}
            <div className="bg-[#2a2a2a] p-8 rounded-lg border border-[#333333]">
              <h4 className="text-xl font-bold text-[#2eaadc] font-inter mb-4">
                Personal Projects
              </h4>
              <ul className="space-y-6 text-gray-300">
                <li className="group">
                  <div className="flex items-start">
                    <span className="text-[#2eaadc] mr-2">•</span>
                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">Group Study Platform</strong>
                        <a 
                          href="https://crap-for-you.onrender.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#2eaadc] group-hover:underline"
                        >
                          <span className="text-sm">Visit Site</span>
                          <FiArrowUpRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                      </div>
                      <p>A collaborative learning environment with real-time interaction features. 
                      Create study groups, share resources, and learn together in an interactive space.</p>
                    </div>
                  </div>
                </li>
                <li className="group">
                  <div className="flex items-start">
                    <span className="text-[#2eaadc] mr-2">•</span>
                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">Note Taking App</strong>
                        <a 
                          href="https://journal-dabria.vercel.app" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#2eaadc] group-hover:underline"
                        >
                          <span className="text-sm">Visit Site</span>
                          <FiArrowUpRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </a>
                      </div>
                      <p>A modern note-taking application with rich text editing and organization features. 
                      Keep your thoughts organized with a clean, intuitive interface.</p>
                    </div>
                  </div>
                </li>
                <li className="group">
                  <div className="flex items-start">
                    <span className="text-[#2eaadc] mr-2">•</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">Portfolio Website</strong>
                      </div>
                      <p>A personal portfolio showcasing my work with a Notion-inspired design. 
                      Built with React, TypeScript, and Tailwind CSS for a modern, responsive experience.</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
