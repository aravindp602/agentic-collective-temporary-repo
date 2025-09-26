// src/components/Layout.js

import Header from './Header';
import Footer from './Footer';
import CommandPalette from './CommandPalette'; // <-- IMPORT
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

// New Spotlight Component
function Spotlight() {
  useEffect(() => {
    const handler = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return <div className="spotlight"></div>;
}

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light-mode');
  const [isPaletteOpen, setPaletteOpen] = useState(false); // <-- STATE FOR PALETTE

  useEffect(() => {
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
      <Spotlight /> {/* <-- ADD SPOTLIGHT */}
      <CommandPalette open={isPaletteOpen} setOpen={setPaletteOpen} /> {/* <-- ADD PALETTE */}
      <div className="background-grid"></div>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
}