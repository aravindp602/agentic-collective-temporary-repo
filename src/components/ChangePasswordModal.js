// src/components/ChangePasswordModal.js

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    const toastId = toast.loading('Changing password...');

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password.');
      }

      toast.success('Password changed successfully!', { id: toastId });
      onClose(); // Close the modal on success
      
    } catch (err) {
      toast.error(err.message, { id: toastId });
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">&times;</button>
        <h3>Change Your Password</h3>
        <form onSubmit={handleSubmit} className="credentials-form" style={{ gap: '20px' }}>
          <div className="form-field">
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <p className="auth-error" style={{ marginBottom: 0 }}>{error}</p>}
          <div className="edit-form-actions">
            <button type="submit" className="cta-button">Update Password</button>
            <button type="button" className="details-link" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}