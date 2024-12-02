import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';
import { socialLinks } from '../config/social';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const links = [
    {
      name: 'GitHub',
      icon: <FiGithub size={24} />,
      url: socialLinks.github,
    },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin size={24} />,
      url: socialLinks.linkedin,
    },
    {
      name: 'Twitter',
      icon: <FiTwitter size={24} />,
      url: socialLinks.twitter,
    },
    {
      name: 'Email',
      icon: <FiMail size={24} />,
      url: `mailto:${socialLinks.email}`,
    },
  ];

  return (
    <section id="contact" className="py-20 bg-surface-light dark:bg-surface-dark">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container mx-auto px-4"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-textPrimary-light dark:text-textPrimary-dark text-center mb-8"
        >
          Get In Touch
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-textSecondary-light dark:text-textSecondary-dark text-center max-w-2xl mx-auto mb-12"
        >
          I'm currently looking for new opportunities. Whether you have a question or just want to say hi, 
          I'll try my best to get back to you!
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex justify-center space-x-6"
        >
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 text-textSecondary-light hover:text-primary dark:text-textSecondary-dark dark:hover:text-primary-light transition-colors duration-300"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
