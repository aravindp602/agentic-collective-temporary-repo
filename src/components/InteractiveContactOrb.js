// src/components/InteractiveContactOrb.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function InteractiveContactOrb({ isOpen, onToggle }) {
    const [step, setStep] = useState(0); // 0: Name, 1: Email, 2: Message
    const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleClose = () => {
        onToggle(false); // Notify parent component to update state
    };
    
    useEffect(() => {
        // Reset form when the orb is closed
        if (!isOpen) {
            setTimeout(() => {
                setStep(0);
                setIsSuccess(false);
                setFormData({ name: '', email: '', message: '', honeypot: '' });
            }, 500); // Wait for closing animation
        }
    }, [isOpen]);

    const handleNextStep = (e) => {
        e.preventDefault();
        if (step === 0 && formData.name.length < 2) {
            toast.error("Please enter your name.");
            return;
        }
        if (step === 1 && !/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Please enter a valid email.");
            return;
        }
        setStep(s => s + 1);
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.message.length < 10) {
            toast.error("Message should be at least 10 characters.");
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Something went wrong.");
            
            setIsSuccess(true);
            setTimeout(handleClose, 2000); // Close after 2s on success
        } catch (error) {
            toast.error(error.message);
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className={`contact-orb ${isOpen ? 'expanded' : ''}`}
            onClick={() => !isOpen && onToggle(true)}
            layout
            transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 15 }}
        >
            <AnimatePresence>
                {!isOpen && (
                    <motion.div key="orb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="orb-content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <span className="orb-label">Get in touch</span>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isOpen && (
                    <motion.div key="form" className="form-content" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
                        <button onClick={handleClose} className="modal-close-btn" style={{color: 'white'}}>&times;</button>
                        {isSuccess ? (
                            <div className="success-content">
                                <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></motion.svg>
                                <h3>Message Sent!</h3>
                            </div>
                        ) : (
                            <form onSubmit={step === 2 ? handleSubmit : handleNextStep}>
                                <AnimatePresence mode="wait">
                                    {step === 0 && <motion.div key="step0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><label>Hi there! What's your name?</label><input name="name" type="text" value={formData.name} onChange={handleChange} autoFocus /></motion.div>}
                                    {step === 1 && <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><label>Thanks! What's your email?</label><input name="email" type="email" value={formData.email} onChange={handleChange} autoFocus /></motion.div>}
                                    {step === 2 && <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}><label>Perfect. What can we help you with?</label><textarea name="message" value={formData.message} onChange={handleChange} autoFocus rows={4}></textarea></motion.div>}
                                </AnimatePresence>
                                <button type="submit" className="orb-submit-btn" disabled={isSubmitting}>
                                    {step < 2 ? 'Next →' : (isSubmitting ? 'Sending...' : 'Send Message')}
                                </button>
                                <input className="honeypot-field" name="honeypot" value={formData.honeypot} onChange={handleChange} tabIndex="-1" />
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}