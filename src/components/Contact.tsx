import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#2a2a2a] rounded-xl p-8 md:p-10 shadow-xl border border-[#333333]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column - Contact Info */}
              <div className="space-y-8">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">Let's Connect</h3>
                  <p className="text-gray-300">
                    Feel free to reach out through any of these platforms or send me a direct message.
                  </p>
                </div>

                <div className="space-y-6">
                  <a
                    href="mailto:pathakvaibhav755@gmail.com"
                    className="flex items-center gap-4 text-gray-300 hover:text-[#2eaadc] transition-colors duration-300 group"
                  >
                    <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center group-hover:bg-[#2eaadc] transition-colors duration-300">
                      <FiMail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Email</p>
                      <p className="text-sm">pathakvaibhav755@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://github.com/Vaibhav007-code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-gray-300 hover:text-[#2eaadc] transition-colors duration-300 group"
                  >
                    <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center group-hover:bg-[#2eaadc] transition-colors duration-300">
                      <FiGithub className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">GitHub</p>
                      <p className="text-sm">View my projects</p>
                    </div>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/vaibhav-pathak-8b8991214/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-gray-300 hover:text-[#2eaadc] transition-colors duration-300 group"
                  >
                    <div className="w-12 h-12 bg-[#333333] rounded-lg flex items-center justify-center group-hover:bg-[#2eaadc] transition-colors duration-300">
                      <FiLinkedin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-white">LinkedIn</p>
                      <p className="text-sm">Connect with me</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#333333] border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#2eaadc] transition-colors duration-300"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#333333] border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#2eaadc] transition-colors duration-300"
                      placeholder="Your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-[#333333] border border-[#444444] rounded-lg text-white focus:outline-none focus:border-[#2eaadc] transition-colors duration-300"
                      placeholder="Your message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2eaadc] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2596c4] transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
