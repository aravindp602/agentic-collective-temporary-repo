// src/pages/signup.js

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous errors

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'Something went wrong!');
        } else {
            // On successful sign-up, redirect to the login page with a success message
            router.push('/login?message=Signup successful! Please sign in.');
        }
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
                  
                  {error && <p className="auth-error">{error}</p>}
                  
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