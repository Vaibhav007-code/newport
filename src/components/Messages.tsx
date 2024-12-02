import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const Messages = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section className="pt-6 pb-0 px-4 md:px-8 bg-[#191919]" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-inter">
            Get in Touch
          </h2>
          <p className="text-gray-300">
            Have a question or want to work together?
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-[#2a2a2a] p-6 rounded-lg border border-[#333333] shadow-lg"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-white font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-[#444444] rounded-lg text-blue-600 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2eaadc] focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-[#444444] rounded-lg text-yellow-500 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2eaadc] focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-white font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 bg-white border border-[#444444] rounded-lg text-red-600 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2eaadc] focus:border-transparent resize-none"
                placeholder="Your message here..."
              />
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-[#2eaadc] text-white rounded-lg font-medium hover:bg-[#2596c4] transition-colors duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Send Message</span>
                <FiSend className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
              </button>
              
              <div className="text-center text-gray-400">
                <p>Or email directly at{' '}
                  <a 
                    href="mailto:pathakvaibhav755@gmail.com"
                    className="text-[#2eaadc] hover:underline"
                  >
                    pathakvaibhav755@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default Messages;
