// src/components/icons/BusinessIcon.js
import { motion } from 'framer-motion';

export default function BusinessIcon() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Central Node */}
            <motion.circle 
                cx="12" cy="12" r="2.5" 
                fill="currentColor"
                filter="url(#glow)"
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* Orbital Group 1 */}
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
                <circle cx="12" cy="5" r="1.5" fill="currentColor" opacity="0.9" />
            </motion.g>

            {/* Orbital Group 2 */}
            <motion.g
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
                <circle cx="18" cy="12" r="2" fill="currentColor" opacity="0.9" />
            </motion.g>

            {/* Orbital Group 3 */}
            <motion.g
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 2 }}
            >
                <circle cx="6" cy="18" r="1.2" fill="currentColor" opacity="0.7" />
            </motion.g>
        </svg>
    );
}