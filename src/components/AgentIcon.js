// src/components/AgentIcon.js
import { motion } from 'framer-motion';
import BusinessIcon from './icons/BusinessIcon';
import CreativityIcon from './icons/CreativityIcon';
import TechnicalIcon from './icons/TechnicalIcon';

const iconMap = {
    Business: BusinessIcon,
    Creativity: CreativityIcon,
    Technical: TechnicalIcon,
    // Add other categories here as you create their icons
};

// A fallback icon if a category doesn't have a custom one yet
const FallbackIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    </svg>
);

export default function AgentIcon({ category }) {
    const IconComponent = iconMap[category] || FallbackIcon;
    
    return (
        <motion.div whileHover={{ scale: 1.15, rotate: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
            <IconComponent />
        </motion.div>
    );
}