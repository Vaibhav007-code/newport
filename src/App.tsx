import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Admin from './components/Admin';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { Toaster } from 'react-hot-toast';

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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if we're on the admin route
    setIsAdmin(window.location.pathname === '/admin');
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAdmin) {
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <Admin />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 3000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <Router>
      <ErrorBoundary>
        <ThemeProvider>
          <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Navbar />
            <Routes>
              <Route path="/" element={
                <main className="pt-16">
                  <Hero />
                  <About />
                  <Projects />
                  <Contact />
                </main>
              } />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/messages" element={<AdminPanel />} />
            </Routes>
            <footer className="text-center py-6 text-gray-400">
              <p> {new Date().getFullYear()} • Designed & Built by <span className="text-[#2eaadc]">Vaibhav</span></p>
            </footer>
          </div>
        </ThemeProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
