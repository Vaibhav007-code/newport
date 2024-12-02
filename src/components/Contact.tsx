import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const Contact: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      id="contact"
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
          Get in Touch
        </motion.h2>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#2a2a2a] rounded-xl p-8 md:p-10 shadow-xl border border-[#333333]"
          >
            <div className="grid grid-cols-1 gap-8">
              <div className="text-center">
                <p className="text-gray-300 text-lg mb-8">
                  I'm always open to new opportunities and collaborations. Feel free to reach out!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.a
                  href="mailto:pathakvaibhav755@gmail.com"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center p-6 bg-[#333333] rounded-lg hover:bg-[#3a3a3a] transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-[#2eaadc] bg-opacity-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-all duration-300">
                    <FiMail className="w-7 h-7 text-[#2eaadc]" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Email</h3>
                  <p className="text-gray-400 text-sm text-center">pathakvaibhav755@gmail.com</p>
                </motion.a>

                <motion.a
                  href="https://github.com/Vaibhav007-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center p-6 bg-[#333333] rounded-lg hover:bg-[#3a3a3a] transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-[#2eaadc] bg-opacity-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-all duration-300">
                    <FiGithub className="w-7 h-7 text-[#2eaadc]" />
                  </div>
                  <h3 className="text-white font-medium mb-2">GitHub</h3>
                  <p className="text-gray-400 text-sm text-center">View my projects</p>
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/vaibhav-pathak-8b8991214/"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center p-6 bg-[#333333] rounded-lg hover:bg-[#3a3a3a] transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-[#2eaadc] bg-opacity-10 rounded-full flex items-center justify-center mb-4 group-hover:bg-opacity-20 transition-all duration-300">
                    <FiLinkedin className="w-7 h-7 text-[#2eaadc]" />
                  </div>
                  <h3 className="text-white font-medium mb-2">LinkedIn</h3>
                  <p className="text-gray-400 text-sm text-center">Let's connect</p>
                </motion.a>
              </div>

              <div className="mt-8 text-center">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  onClick={() => window.location.href = 'mailto:pathakvaibhav755@gmail.com'}
                  className="bg-[#2eaadc] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2596c4] transition-colors duration-300 inline-flex items-center gap-2"
                >
                  <FiMail className="w-5 h-5" />
                  <span>Send me an email</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
