import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

const Contact: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryTimeout, setRetryTimeout] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 3;
    const reconnectDelay = 5000; // 5 seconds

    const connectSocket = () => {
      // Get the current hostname
      const currentHost = window.location.origin;
      console.log('Connecting to:', currentHost);

      const newSocket = io(currentHost, {
        path: '/socket.io/',
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectDelay,
        timeout: 10000,
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        reconnectAttempts = 0;
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(connectSocket, reconnectDelay * Math.pow(2, reconnectAttempts));
        } else {
          toast.error('Server connection failed. Please try again later.');
        }
      });

      newSocket.on('message-sent', (response) => {
        setIsSubmitting(false);
        
        if (response.success) {
          toast.success(response.message || 'Message sent successfully!');
          setFormData({ name: '', email: '', message: '' });
          setRetryTimeout(null);
        } else {
          toast.error(response.error || 'Failed to send message');
          
          // Handle rate limiting
          if (response.retryAfter) {
            const retryAfter = response.retryAfter * 1000;
            setRetryTimeout(Date.now() + retryAfter);
            
            // Clear retry timeout after it expires
            setTimeout(() => {
              setRetryTimeout(null);
            }, retryAfter);
          }
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    };

    connectSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we're in a retry timeout period
    if (retryTimeout && Date.now() < retryTimeout) {
      const waitSeconds = Math.ceil((retryTimeout - Date.now()) / 1000);
      toast.error(`Please wait ${waitSeconds} seconds before trying again`);
      return;
    }

    // Validate form data
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!socket?.connected) {
      toast.error('Not connected to server. Trying to reconnect...');
      return;
    }

    setIsSubmitting(true);
    socket.emit('send-message', formData);
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-white mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2eaadc]"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-white mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2eaadc]"
                      placeholder="Your email"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-white mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2eaadc] resize-none"
                      placeholder="Your message"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#2eaadc] text-white py-3 rounded-lg transition-all duration-300 ${
                      isSubmitting
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#2596c4] transform hover:translate-y-[-2px]'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
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
