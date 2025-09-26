// src/pages/signup.js

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Sign up functionality is for demonstration only.');
    };

    return (
      <>
        <Head><title>Sign Up | Agentic Collective</title></Head>
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-box-content">
                <Link href="/" className="logo">Agentic Collective</Link>
                <h1>Create an Account</h1>
                <p>Join the collective and start exploring.</p>
                
                <form onSubmit={handleSubmit} className="credentials-form">
                  <div className="form-field"><label htmlFor="name">Full Name</label><input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required /></div>
                  <div className="form-field"><label htmlFor="email">Email Address</label><input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                  <div className="form-field"><label htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
                  <button type="submit" className="cta-button">Create Account</button>
                </form>
                
                <div className="auth-footer-text">
                    Already have an account? <Link href="/login">Sign in</Link>
                </div>
            </div>
          </div>
        </div>
      </>
    );
}