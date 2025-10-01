// src/components/Header.js

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from 'react';
import ChangePasswordModal from './ChangePasswordModal';

export default function Header({ theme, toggleTheme }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [dropdownRef]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const isLoggedIn = status === "authenticated" && session?.user;
  const isPasswordUser = isLoggedIn && session.user.provider !== 'google' && session.user.provider !== 'github';

  return (
    <>
      <header className="main-header">
        <div className="container header-container">
          <Link href="/" className="logo">
            <Image src="/logo.svg" alt="Agentic Collective Logo" width={40} height={40} priority />
            <span>Digital Lesson</span>
          </Link>
          
          {/* This nav is now a direct child, making it easy to hide */}
          <nav className="desktop-nav">
            <Link href="/" className={router.pathname === '/' ? 'is-active' : ''}>Explore</Link>
            {isLoggedIn && (<Link href="/dashboard" className={router.pathname === '/dashboard' ? 'is-active' : ''}>Dashboard</Link>)}
          </nav>

          <div className="header-controls">
            {/* The action buttons are now grouped together */}
            <div className="header-actions">
              <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme" aria-label="Toggle theme">
                  {theme === 'light-mode' ? ( <span className="sun-icon">☀️</span> ) : ( <span className="moon-icon">🌙</span> )}
              </button>
              <div className="auth-controls">
                {status === "loading" ? <div className="loader"></div> : isLoggedIn ? (
                  <div className="profile-menu" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="avatar-button">
                      {session.user.image ? (<img src={session.user.image} alt={session.user.name} className="avatar" />) : (<div className="avatar-placeholder">{session.user.name?.charAt(0)}</div>)}
                    </button>
                    {isDropdownOpen && (
                      <div className="dropdown-menu">
                        <div className="dropdown-header"><span className="user-name">{session.user.name}</span><span className="user-email">{session.user.email}</span></div>
                        <Link href="/dashboard" className="dropdown-item">Dashboard</Link>
                        {isPasswordUser && (<button onClick={() => { setChangePasswordOpen(true); setIsDropdownOpen(false); }} className="dropdown-item">Change Password</button>)}
                        <button onClick={() => signOut({ callbackUrl: '/' })} className="dropdown-item signout">Sign Out</button>
                      </div>
                    )}
                  </div>
                ) : (<button onClick={() => signIn()} className="signin-btn">Sign In</button>)}
              </div>
            </div>

            {/* The hamburger is separate, for mobile only */}
            <div className="mobile-menu-toggle">
              <button className={`hamburger-btn ${isMobileMenuOpen ? 'is-open' : ''}`} onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                <span className="hamburger-icon"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <nav>
          <Link href="/">Explore</Link>
          {isLoggedIn && (<Link href="/dashboard">Dashboard</Link>)}
        </nav>
        <div className="mobile-nav-footer">
            {isLoggedIn ? (
                <button onClick={() => signOut({ callbackUrl: '/' })} className="cta-button">Sign Out</button>
            ) : (
                <button onClick={() => signIn()} className="cta-button">Sign In</button>
            )}
        </div>
      </div>

      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </>
  );
}