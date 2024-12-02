import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Messages from './components/Messages';

const LoadingScreen = () => {
  return (
    <div className="h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-display text-primary-dark dark:text-primary-light"
      >
        VP
      </motion.div>
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
          <Navbar />
          <main className="pt-16">
            <Hero />
            <About />
            <Projects />
            <Messages />
            <Contact />
          </main>
          <footer className="text-center py-6 text-textSecondary-light dark:text-textSecondary-dark">
            <p> {new Date().getFullYear()} Vaibhav Pathak. All rights reserved.</p>
          </footer>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
