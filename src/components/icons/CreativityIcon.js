// src/components/icons/CreativityIcon.js
import { motion } from 'framer-motion';

export default function CreativityIcon() {
    return (
        <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <defs>
                {/* The "gooey" filter effect */}
                <filter id="gooey-effect">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                    <feColorMatrix 
                        in="blur" 
                        mode="matrix" 
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
                        result="goo" 
                    />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
            </defs>

            {/* Apply the filter to a group containing all the circles */}
            <g filter="url(#gooey-effect)" fill="currentColor">
                <motion.circle 
                    r="5"
                    animate={{ 
                        cx: [12, 15, 9, 12],
                        cy: [12, 9, 15, 12]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                 <motion.circle 
                    r="4"
                    animate={{ 
                        cx: [8, 12, 10, 8],
                        cy: [10, 8, 14, 10]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                <motion.circle 
                    r="3"
                    animate={{ 
                        cx: [16, 11, 16],
                        cy: [14, 16, 14]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                />
            </g>
        </svg>
    );
}