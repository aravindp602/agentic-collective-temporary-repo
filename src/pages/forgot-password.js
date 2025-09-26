// src/pages/forgot-password.js

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Sending reset link...');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            
            // For security, we always show a success state to the user
            // This prevents people from guessing which emails are registered
            toast.success(data.message, { id: toastId });
            setSubmitted(true);
            
        } catch (error) {
            toast.error('An unexpected error occurred. Please try again.', { id: toastId });
        }
    };

    return (
        <>
            <Head><title>Forgot Password | Agentic Collective</title></Head>
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-box-content">
                        <Link href="/" className="logo">Agentic Collective</Link>
                        <h1>Reset Your Password</h1>
                        
                        {submitted ? (
                            <p className="text-center">If an account with that email exists, a reset link has been sent. Please check your inbox (and spam folder).</p>
                        ) : (
                            <>
                                <p>Enter your email address and we will send you a link to reset your password.</p>
                                <form onSubmit={handleSubmit} className="credentials-form">
                                    <div className="form-field">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="cta-button">Send Reset Link</button>
                                </form>
                            </>
                        )}
                        
                        <div className="auth-footer-text">
                            Remember your password? <Link href="/login">Sign in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}