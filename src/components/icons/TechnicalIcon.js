// src/components/icons/TechnicalIcon.js
import { motion } from 'framer-motion';

export default function TechnicalIcon() {
    const numRows = 5;
    const numCols = 5;
    const gridPoints = Array.from({ length: numRows * numCols });

    const containerVariants = {
        animate: {
            transition: {
                // The staggerChildren value is calculated to match the scanner's speed
                staggerChildren: 0.15, 
            },
        },
    };

    const dotVariants = {
        initial: { opacity: 0.2, scale: 0.8 },
        animate: { 
            opacity: [0.2, 1, 0.2], 
            scale: [0.8, 1.2, 0.8],
            transition: { duration: 0.8, ease: 'circOut' }
        },
    };

    return (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            {/* The Scanner Line */}
            <motion.line 
                x1="4" y1="4" x2="20" y2="4" 
                stroke="currentColor" 
                strokeWidth="1.5"
                strokeLinecap='round'
                animate={{ y1: [4, 20, 4], y2: [4, 20, 4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            
            {/* The Grid of Dots */}
            <motion.g variants={containerVariants} initial="initial" animate="animate">
                {gridPoints.map((_, i) => {
                    const row = Math.floor(i / numCols);
                    const col = i % numCols;
                    return (
                        <motion.circle
                            key={i}
                            cx={6 + col * 3}
                            cy={6 + row * 3}
                            r="1"
                            variants={dotVariants}
                            // Trigger each row's animation with a slight delay
                            transition={{ delay: row * 0.15 }}
                        />
                    );
                })}
            </motion.g>
        </svg>
    );
}