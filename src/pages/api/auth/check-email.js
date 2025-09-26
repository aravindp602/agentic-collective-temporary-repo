// src/pages/auth/check-email.js
import Head from "next/head";
import { useRouter } from "next/router";

export default function CheckEmailPage() {
    const router = useRouter();
    const { email } = router.query;
    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Check your email</h1>
                <p>A sign-in link has been sent to <strong>{email || 'your email address'}</strong>.</p>
            </div>
        </div>
    );
}