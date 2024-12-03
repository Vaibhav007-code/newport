import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import ContactForm from './ContactForm';

const Contact: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-black text-white"
    >
      <div className="max-w-4xl w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Get in Touch</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Connect With Me</h2>
            
            <div className="space-y-4">
              <a
                href="https://github.com/Vaibhav007-code"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <FiGithub className="text-2xl" />
                <span>GitHub</span>
              </a>

              <a
                href="https://www.linkedin.com/in/vaibhav-pathak-8b8991214/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <FiLinkedin className="text-2xl" />
                <span>LinkedIn</span>
              </a>

              <a
                href="mailto:pathakvaibhav755@gmail.com"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <FiMail className="text-2xl" />
                <span>Email</span>
              </a>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-300">
                I typically respond within 24-48 hours. Feel free to reach out through any of these channels!
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
