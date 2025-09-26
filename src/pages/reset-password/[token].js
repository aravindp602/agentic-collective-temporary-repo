// src/pages/reset-password/[token].js

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = router.query;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const toastId = toast.loading('Resetting password...');

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            toast.success('Password reset successfully! You can now sign in.', { id: toastId });
            setSuccess(true);
            setTimeout(() => router.push('/login'), 2000);

        } catch (err) {
            toast.error(err.message, { id: toastId });
            setError(err.message);
        }
    };
    
    if (success) {
        return (
             <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-box-content">
                        <h1>Success!</h1>
                        <p>Your password has been reset. Redirecting you to the login page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head><title>Reset Password | Agentic Collective</title></Head>
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-box-content">
                        <Link href="/" className="logo">Agentic Collective</Link>
                        <h1>Choose a New Password</h1>
                        
                        <form onSubmit={handleSubmit} className="credentials-form">
                            <div className="form-field">
                                <label htmlFor="password">New Password</label>
                                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                            <div className="form-field">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                            </div>
                            
                            {error && <p className="auth-error">{error}</p>}
                            
                            <button type="submit" className="cta-button">Reset Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}