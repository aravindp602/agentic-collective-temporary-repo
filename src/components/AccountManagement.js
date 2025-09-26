// src/components/AccountManagement.js

import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function AccountManagement() {

    const handleDeleteAccount = async () => {
        // A simple confirmation dialog is crucial for destructive actions
        const isConfirmed = window.confirm(
            "Are you absolutely sure you want to delete your account? This action cannot be undone."
        );

        if (!isConfirmed) {
            return;
        }

        const toastId = toast.loading('Deleting account...');

        try {
            const response = await fetch('/api/user/delete-account', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete account.');
            }

            toast.success('Account deleted successfully. Signing you out...', { id: toastId });

            // Sign the user out completely after their account is gone
            setTimeout(() => {
                signOut({ callbackUrl: '/' });
            }, 1500);

        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    return (
        <div className="dashboard-section">
            <h2>Account Management</h2>
            <div className="danger-zone">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button onClick={handleDeleteAccount} className="danger-button">
                    Delete My Account
                </button>
            </div>
        </div>
    );
}