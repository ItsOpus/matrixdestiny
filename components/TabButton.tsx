
import React from 'react';
import { motion } from 'framer-motion';

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ isActive, onClick, children }) => (
    <button 
        onClick={onClick} 
        className={`relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none
                    ${isActive ? 'text-white' : 'text-gray-400 hover:text-purple-300 hover:bg-purple-500/10'}`}
    >
        <span className="relative z-10 flex items-center">{children}</span>
        {isActive && (
            <motion.div 
                layoutId="activeTabIndicatorDestinyMatrix" // Unique layoutId
                className="absolute inset-0 bg-purple-600/50 rounded-md z-0" 
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            />
        )}
    </button>
);

export default TabButton;
