import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiArrowUpRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center py-20 bg-[#191919]">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white font-inter tracking-tight">
              Hi, I'm{' '}
              <span className="text-[#2eaadc]">
                Vaibhav Pathak
              </span>
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-inter">
              Full Stack Developer crafting elegant solutions through code.
              <span className="text-[#2eaadc]"> Available for new opportunities.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="#projects"
              className="bg-[#2a2a2a] border border-[#333333] px-6 py-3 rounded-lg text-white hover:bg-[#333333] transition-all duration-300 inline-flex items-center gap-2 font-inter group"
            >
              <span>View Projects</span>
              <FiArrowUpRight className="w-5 h-5 text-[#2eaadc] transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            
            <a
              href="#contact"
              className="bg-[#2a2a2a] border border-[#333333] px-6 py-3 rounded-lg text-white hover:bg-[#333333] transition-all duration-300 font-inter"
            >
              Contact Me
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 flex gap-8 justify-center"
          >
            <a
              href="https://github.com/Vaibhav007-code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#2eaadc] transition-colors duration-300 group relative"
              aria-label="GitHub"
            >
              <FiGithub size={24} />
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
              <FiLinkedin size={24} />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                LinkedIn
              </span>
            </a>
            <a
              href="mailto:pathakvaibhav755@gmail.com"
              className="text-gray-400 hover:text-[#2eaadc] transition-colors duration-300 group relative"
              aria-label="Email"
            >
              <FiMail size={24} />
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-[#2a2a2a] text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Email
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
