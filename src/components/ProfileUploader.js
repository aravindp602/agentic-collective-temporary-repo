// src/components/ProfileUploader.js

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function ProfileUploader() {
  // Get the `update` function from useSession
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File is too large (max 5MB).');
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading('Uploading picture...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload.');
      }
      
      // CRITICAL: This is the correct way to update the session.
      // We pass the new image path from the API response to the `update` function.
      await update({ image: data.user.image });

      toast.success('Profile picture updated!', { id: toastId });

    } catch (error) {
      toast.error(error.message || 'Upload failed.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="profile-avatar-wrapper" style={{ position: 'relative' }}>
      <img 
          src={session.user.image} 
          alt={session.user.name} 
          className="avatar" 
          style={{ width: '80px', height: '80px', border: '2px solid var(--border-dark)', objectFit: 'cover' }} 
      />
      <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept="image/png, image/jpeg, image/webp"
      />
      <button
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
          disabled={isUploading}
          title="Upload new picture"
          style={{
              position: 'absolute', bottom: 0, right: 0,
              background: 'var(--card-bg-dark)', border: '1px solid var(--border-dark)',
              borderRadius: '50%', width: '32px', height: '32px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              fontSize: '16px'
          }}
      >
          ✏️
      </button>
    </div>
  );
}