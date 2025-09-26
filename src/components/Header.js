// src/components/Header.js

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // This variable will be true only when the session has loaded AND contains a user.
  const isLoggedIn = status === "authenticated" && session?.user;

  return (
    <header className="main-header">
      <div className="container">
        <Link href="/" className="logo">
          <Image 
            src="/logo.svg" 
            alt="Agentic Collective Logo" 
            width={40}
            height={40}
            priority
          />
          <span>Agentic Collective</span>
        </Link>
        
        <div className="header-controls">
          <nav>
            <Link href="/" className={router.pathname === '/' ? 'is-active' : ''}>Explore</Link>
            {isLoggedIn && (
              <Link href="/dashboard" className={router.pathname === '/dashboard' ? 'is-active' : ''}>Dashboard</Link>
            )}
          </nav>
          
          <div className="header-actions">
            <button className="theme-toggle" id="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
                <span className="sun-icon">☀️</span>
                <span className="moon-icon">🌙</span>
            </button>
            
            <div className="auth-controls">
              {status === "loading" ? (
                <div className="loader"></div>
              ) : isLoggedIn ? (
                <div className="profile-menu" ref={dropdownRef}>
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="avatar-button">
                    {/* The session.user.image is now guaranteed to exist here */}
                    <img src={session.user.image} alt={session.user.name} className="avatar" />
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <span className="user-name">{session.user.name}</span>
                        <span className="user-email">{session.user.email}</span>
                      </div>
                      <Link href="/dashboard" className="dropdown-item">Dashboard</Link>
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="dropdown-item signout">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => signIn()} className="signin-btn">Sign In</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}