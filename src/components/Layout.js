// src/components/Layout.js

import Header from './Header';
import Footer from './Footer';
import CommandPalette from './CommandPalette';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSession, signOut } from "next-auth/react";
import InteractiveContactOrb from './InteractiveContactOrb';

// The Spotlight component creates the mouse-follow gradient effect
function Spotlight() {
  useEffect(() => {
    const handler = (e) => {
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return <div className="spotlight"></div>;
}

export default function Layout({ children }) {
  const [theme, setTheme] = useState('light-mode');
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const { data: session } = useSession();
  
  // This state now controls the open/closed state of the InteractiveContactOrb
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Load the saved theme from localStorage when the component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === 'light-mode' ? 'dark-mode' : 'light-mode';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  // Function to handle user sign-out
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };
  
  // This function will be called from the Command Palette to open the orb
  const handleOpenContact = () => {
      setIsContactOpen(true);
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
      <Spotlight />
      
      <CommandPalette 
        open={isPaletteOpen} 
        setOpen={setPaletteOpen}
        toggleTheme={toggleTheme}
        handleSignOut={handleSignOut}
        isLoggedIn={!!session}
        openContact={handleOpenContact} // Pass the function to the command palette
      />

      <div className="background-grid"></div>
      
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      <main>
        {children}
      </main>
      
      <Footer />
      
      {/* 
        The InteractiveContactOrb is now controlled by the state in this Layout component.
        This allows both the Command Palette and the orb itself to control its state.
      */}
      <InteractiveContactOrb 
        isOpen={isContactOpen}
        onToggle={setIsContactOpen} // Pass the state setter function
      />
    </>
  );
}