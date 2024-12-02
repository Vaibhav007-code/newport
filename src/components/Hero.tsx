import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi';

const Hero: React.FC = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-[#191919] px-4 sm:px-6 lg:px-8 py-16"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white"
            >
              Hi, I'm{' '}
              <span className="text-[#2eaadc] inline-block">
                Vaibhav Pathak
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              Full Stack Developer crafting elegant solutions through code.
              <span className="text-[#2eaadc]"> Available for new opportunities.</span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <a
              href="#projects"
              className="w-full sm:w-auto bg-[#2a2a2a] border border-[#333333] px-6 py-3 rounded-lg text-white hover:bg-[#333333] transition-all duration-300 inline-flex items-center justify-center gap-2 group"
            >
              <span>View Projects</span>
              <FiArrowUpRight className="w-5 h-5 text-[#2eaadc] transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            
            <a
              href="#contact"
              className="w-full sm:w-auto bg-[#2a2a2a] border border-[#333333] px-6 py-3 rounded-lg text-white hover:bg-[#333333] transition-all duration-300 text-center"
            >
              Contact Me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex items-center gap-6"
          >
            <a
              href="https://github.com/Vaibhav007-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#2eaadc] transition-colors duration-300 group relative"
              aria-label="GitHub"
            >
              <FiGithub className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                GitHub
              </span>
            </a>

            <a
              href="https://www.linkedin.com/in/vaibhav-pathak-8b8991214/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#2eaadc] transition-colors duration-300 group relative"
              aria-label="LinkedIn"
            >
              <FiLinkedin className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                LinkedIn
              </span>
            </a>

            <a
              href="mailto:pathakvaibhav755@gmail.com"
              className="text-gray-400 hover:text-[#2eaadc] transition-colors duration-300 group relative"
              aria-label="Email"
            >
              <FiMail className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Email
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
