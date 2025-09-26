// src/components/ProfileSection.js

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ProfileSection() {
    const { data: session, update } = useSession();
    const [name, setName] = useState('');
    const [editMode, setEditMode] = useState(false);
    
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [isCropModalOpen, setCropModalOpen] = useState(false);
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    const handleNameUpdate = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Updating name...');
        try {
            const response = await fetch('/api/user/update-name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            await update({ name: data.user.name });
            toast.success('Name updated!', { id: toastId });
            setEditMode(false);
        } catch (error) {
            toast.error(error.message || 'Failed to update name.', { id: toastId });
        }
    };

    // --- THIS IS THE MODIFIED FUNCTION, NOW USING FORMDATA ---
    const handleCropAndUpload = () => {
        if (!completedCrop || !imgRef.current) return;

        const canvas = document.createElement('canvas');
        const image = imgRef.current;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, completedCrop.width, completedCrop.height);
        
        setCropModalOpen(false);

        canvas.toBlob(async (blob) => {
            if (!blob) {
                toast.error("Failed to process the image. Please try again.");
                return;
            }

            // Create a FormData object to wrap the file data.
            const formData = new FormData();
            // Append the blob with the key 'image', which our backend expects.
            formData.append('image', blob, 'profile-picture.jpg');

            const toastId = toast.loading('Uploading picture...');
            try {
                // Send the FormData object in the body.
                // It's crucial NOT to set the 'Content-Type' header here,
                // as the browser will do it automatically with the correct boundary.
                const response = await fetch('/api/user/update-profile', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message);
                
                await update({ image: data.user.image });
                toast.success('Profile picture updated!', { id: toastId });
            } catch (error) {
                toast.error(error.message || 'Upload failed.', { id: toastId });
            }
        }, 'image/jpeg');
    };
    
    const onSelectFile = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            setCropModalOpen(true);
        }
    };

    const onImageLoad = (e) => {
        const { width, height } = e.currentTarget;
        const crop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 1, width, height), width, height);
        setCrop(crop);
    };
    
    if (!session) return null;

    const userInitial = session.user.name?.charAt(0) || '?';

    return (
        <>
            <div className="profile-section-card">
                <div className="profile-avatar-wrapper" style={{ position: 'relative' }}>
                    {session.user.image ? (
                        <img src={session.user.image} alt={session.user.name} className="avatar" style={{ width: '100px', height: '100px', border: '3px solid var(--border-dark)', objectFit: 'cover' }} />
                    ) : (
                        <div className="avatar-placeholder">{userInitial}</div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={onSelectFile} style={{ display: 'none' }} accept="image/png, image/jpeg, image/webp" />
                    <button className="upload-btn" onClick={() => fileInput.current.click()} title="Upload new picture" style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--card-bg-dark)', border: '1px solid var(--border-dark)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px' }}>✏️</button>
                </div>
                <div className="profile-details">
                    <div className="profile-header">
                        <h2>{session.user.name}</h2>
                        <button className="edit-profile-btn" onClick={() => setEditMode(!editMode)}>{editMode ? 'Cancel' : 'Edit Profile'}</button>
                    </div>
                    <p className="profile-email">{session.user.email}</p>
                    {editMode && (
                        <form className="profile-edit-form" onSubmit={handleNameUpdate}>
                            <div className="form-field-inline">
                                <label htmlFor="name">Display Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="edit-form-actions">
                                <button type="submit" className="cta-button" style={{padding: '10px 20px', fontSize: '0.9rem'}}>Save Changes</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            {isCropModalOpen && (
                <div className="modal-overlay active">
                    <div className="crop-modal-content">
                        <h3>Crop Your New Avatar</h3>
                        <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={1}>
                            <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} alt="Crop preview" style={{maxHeight: '70vh'}} />
                        </ReactCrop>
                        <div className="edit-form-actions" style={{justifyContent: 'center', marginTop: '24px'}}>
                           <button onClick={handleCropAndUpload} className="cta-button">Save Avatar</button>
                           <button onClick={() => setCropModalOpen(false)} className="details-link">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}