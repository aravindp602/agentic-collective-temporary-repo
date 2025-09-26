// src/components/Layout.js

import Header from './Header';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'; // <-- 1. IMPORT THE TOASTER

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light-mode');

  useEffect(() => {
    // Set a default theme on the first load if nothing is saved
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  return (
    <>
      {/* 2. ADD THE TOASTER COMPONENT HERE */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--card-bg-dark)',
            color: 'var(--text-primary-dark)',
            border: '1px solid var(--border-dark)',
          },
        }}
      />
      <div className="background-grid"></div>
      {/* 3. PASS THEME AND TOGGLE FUNCTION TO THE HEADER */}
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}