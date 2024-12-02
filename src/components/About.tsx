import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiBriefcase, FiLayers } from 'react-icons/fi';

const About: React.FC = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="about" 
      className="py-20 bg-[#191919] min-h-screen flex items-center"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
        >
          About Me
        </motion.h2>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#2a2a2a] p-6 sm:p-8 rounded-lg border border-[#333333] mb-12"
          >
            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-6">
              I'm a Full Stack Web Developer passionate about creating impactful digital solutions. 
              With expertise in both frontend and backend technologies, I've collaborated with various 
              businesses to deliver custom solutions that make a difference.
            </p>
            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed">
              Throughout my journey, I've developed several notable projects including a group study 
              platform and a feature-rich note-taking application, demonstrating my ability to turn 
              ideas into functional, user-friendly applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-[#2a2a2a] p-6 rounded-lg border border-[#333333] hover:border-[#2eaadc] transition-all duration-300"
            >
              <FiCode className="text-[#2eaadc] w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Technical Skills</h3>
              <p className="text-gray-300 leading-relaxed">
                Proficient in React, TypeScript, Node.js, Express, MongoDB, and modern web technologies.
                Experienced in building responsive, scalable applications.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-[#2a2a2a] p-6 rounded-lg border border-[#333333] hover:border-[#2eaadc] transition-all duration-300"
            >
              <FiBriefcase className="text-[#2eaadc] w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Experience</h3>
              <p className="text-gray-300 leading-relaxed">
                Collaborated with businesses to create custom web solutions.
                Specialized in e-commerce and business automation projects.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-[#2a2a2a] p-6 rounded-lg border border-[#333333] hover:border-[#2eaadc] transition-all duration-300"
            >
              <FiLayers className="text-[#2eaadc] w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Projects</h3>
              <p className="text-gray-300 leading-relaxed">
                Built innovative solutions including a collaborative group study platform
                and an intuitive note-taking application.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
